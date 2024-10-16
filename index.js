const express = require('express');
const { DynamoDBClient, PutItemCommand, UpdateItemCommand, DeleteItemCommand, GetItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Initialize DynamoDB client (AWS SDK v3)
const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE_NAME = 'comic-book';

// 1. Create a Comic Book
app.post('/comics', async (req, res) => {
    const { book_name, author, year, price, discount, pages, condition, description } = req.body;
    const book_id = uuidv4(); // Generate a unique ID for each comic book

    const params = {
        TableName: TABLE_NAME,
        Item: marshall({
            book_id,
            book_name,
            author,
            year,
            price,
            discount,
            pages,
            condition,
            description
        })
    };

    try {
        await dynamoDbClient.send(new PutItemCommand(params));
        res.status(201).json({ message: 'Comic Book created successfully', book_id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Could not create comic book', details: error.message });
    }
});

// 2. Edit a Comic Book
app.put('/comics/:book_id', async (req, res) => {
    const { book_id } = req.params;
    const { book_name, author, year, price, discount, pages, condition, description } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Key: marshall({ book_id }),
        UpdateExpression: 'set book_name = :book_name, author = :author, year = :year, price = :price, discount = :discount, pages = :pages, condition = :condition, description = :description',
        ExpressionAttributeValues: marshall({
            ':book_name': book_name,
            ':author': author,
            ':year': year,
            ':price': price,
            ':discount': discount,
            ':pages': pages,
            ':condition': condition,
            ':description': description
        }),
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await dynamoDbClient.send(new UpdateItemCommand(params));
        res.json({ message: 'Comic Book updated successfully', updatedAttributes: unmarshall(result.Attributes) });
    } catch (error) {
        res.status(500).json({ error: 'Could not update comic book', details: error.message });
    }
});

// 3. Delete a Comic Book
app.delete('/comics/:book_id', async (req, res) => {
    const { book_id } = req.params;

    const params = {
        TableName: TABLE_NAME,
        Key: marshall({ book_id })
    };

    try {
        await dynamoDbClient.send(new DeleteItemCommand(params));
        res.json({ message: 'Comic Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete comic book', details: error.message });
    }
});

// 4. Fetch Inventory List with Pagination, Filtering, and Sorting
app.get('/comics', async (req, res) => {
    const { limit, start_key, author, year, price_lt, sort_by, order } = req.query;

    let params = {
        TableName: TABLE_NAME,
        Limit: limit ? parseInt(limit) : 10,
    };

    if (start_key) {
        params.ExclusiveStartKey = marshall({ book_id: start_key });
    }

    let filterExpressions = [];
    let expressionAttributeValues = {};

    // Filtering logic
    if (author) {
        filterExpressions.push('author = :author');
        expressionAttributeValues[':author'] = author;
    }
    if (year) {
        filterExpressions.push('year = :year');
        expressionAttributeValues[':year'] = parseInt(year);
    }
    if (price_lt) {
        filterExpressions.push('price <= :price');
        expressionAttributeValues[':price'] = parseFloat(price_lt);
    }

    if (filterExpressions.length > 0) {
        params.FilterExpression = filterExpressions.join(' AND ');
        params.ExpressionAttributeValues = marshall(expressionAttributeValues);
    }

    try {
        const data = await dynamoDbClient.send(new ScanCommand(params));

        // Sorting logic (manually, since DynamoDB doesn't support server-side sorting)
        let items = data.Items.map(item => unmarshall(item));
        if (sort_by) {
            items.sort((a, b) => {
                if (order === 'desc') {
                    return b[sort_by] - a[sort_by];
                }
                return a[sort_by] - b[sort_by];
            });
        }

        res.json({
            comics: items,
            lastEvaluatedKey: data.LastEvaluatedKey ? unmarshall(data.LastEvaluatedKey) : null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch comics', details: error.message });
    }
});

// 5. Get Comic Book Details by ID
app.get('/comics/:book_id', async (req, res) => {
    const { book_id } = req.params;

    const params = {
        TableName: TABLE_NAME,
        Key: marshall({ book_id })
    };

    try {
        const data = await dynamoDbClient.send(new GetItemCommand(params));
        if (!data.Item) {
            return res.status(404).json({ error: 'Comic Book not found' });
        }
        res.json(unmarshall(data.Item));
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch comic book details', details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
