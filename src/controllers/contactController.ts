import { Request, Response } from 'express';
import axios from 'axios';
import logger from '../logger';

// Endpoint to handle combined request
export const createContactEndpoint = async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstname, telephone1, productId, name, phone, origin, status } = req.body;

        // Validate required fields
        if (!firstname || !telephone1) {
            return res.status(400).json({ error: 'Missing required fields: firstname or telephone1' });
        }

        // Step 1: Create Contact
        const contactResponse = await axios.post(
            'https://api.fireberry.com/api/record/contact',
            {
                firstname,
                telephone1,
            },
            {
                headers: {
                    'tokenid': 'b6405927-2290-4993-9b78-79e5f94d358e',
                    'Content-Type': 'application/json',
                },
            }
        );
        logger.info('Contact created:', contactResponse.data);

        // Extract contactId from the response
        const contactId = contactResponse.data.data.Record.contactid;

        // Step 2: Send additional request with contactId
        const secondResponse = await axios.post(
            'https://api.fireberry.com/api/record/1002',
            {
                pcfsystemfield100: productId, // Product
                name: name, // Name
                pcfsystemfield102: status || 1, // Status
                pcfsystemfield106: phone, // Contact phone
                pcfOrigin: origin || 1, // Constant 1
                pcfContact: contactId, // Contact ID
            },
            {
                headers: {
                    'tokenid': 'b6405927-2290-4993-9b78-79e5f94d358e',
                    'Content-Type': 'application/json',
                },
            }
        );
        logger.info(`Second request response:, ${JSON.stringify(secondResponse.data)}`);

        // Flatten the response
        const flattenedResponse = {
            success: secondResponse.data.success,
            ...secondResponse.data.data.Record,
        };

        // Return the final response
        return res.status(200).json(flattenedResponse);
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
};