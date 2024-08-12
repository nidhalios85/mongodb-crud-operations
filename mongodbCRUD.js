const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to database");

        const db = client.db('contact');
        const collection = db.collection('contactlist');

        const contacts = [
            { "Last name": "Ben", "First name": "Moris", "Email": "ben@gmail.com", "age": 26 },
            { "Last name": "Kefi", "First name": "Seif", "Email": "kefi@gmail.com", "age": 15 },
            { "Last name": "Emilie", "First name": "Brouge", "Email": "emilie.b@gmail.com", "age": 40 },
            { "Last name": "Alex", "First name": "Brown", "age": 4 },
            { "Last name": "Denzel", "First name": "Washington", "age": 3 }
        ];


        //insert contacts
        const result = await collection.insertMany(contacts);
        console.log(`${result.insertedCount} documents were inserted`);


        //display all
        const allContacts = await collection.find({}).toArray();
        console.log("All Contacts:", allContacts);


        //find by id
        const specificContact = await collection.findOne({ _id: result.insertedIds['0'] });
        console.log("Specific Contact:", specificContact);


        //filter +18
        const adults = await collection.find({ age: { $gt: 18 } }).toArray();
        console.log("Contacts with age > 18:", adults);

        const filteredContacts = await collection.find({ age: { $gt: 18 }, "First name": { $regex: "ah", $options: "i" } }).toArray();
        console.log("Contacts with age > 18 and name containing 'ah':", filteredContacts);

        const updateResult = await collection.updateOne({ "Last name": "Kefi", "First name": "Seif" }, { $set: { "First name": "Anis" } });
        console.log(`${updateResult.matchedCount} document(s) matched the filter, ${updateResult.modifiedCount} document(s) was/were updated.`);


        //delete -5
        const deleteResult = await collection.deleteMany({ age: { $lt: 5 } });
        console.log(`${deleteResult.deletedCount} document(s) were deleted.`);

        const remainingContacts = await collection.find({}).toArray();
        console.log("Remaining Contacts:", remainingContacts);

    } finally {
        await client.close();
    }
}

main().catch(console.error);
