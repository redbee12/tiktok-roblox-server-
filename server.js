
// Import potrzebnych bibliotek
const express = require("express");
const cors = require("cors");

// Inicjalizacja aplikacji Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let actionQueue = [];

app.post("/tiktok-event", (req, res) => {
    const eventData = req.body;
    if (!eventData || Object.keys(eventData).length === 0) {
        console.log("Ping od TikFinity.");
        return res.status(200).json({ message: "OK" });
    }

    const giftName = eventData.content || eventData.giftName;
    const sender = eventData.username || eventData.sender;
    const giftId = eventData.giftId || "N/A";

    if (!giftName || !sender) {
        console.log("Błędne dane:", eventData);
        return res.status(400).json({ message: "Nieprawidłowe dane." });
    }

    console.log(`🎁 Prezent "${giftName}" (ID: ${giftId}) od "${sender}"`);

    actionQueue.push({ gift_name: giftName, sender, gift_id: giftId });

    res.status(200).json({ message: "Dodano do kolejki." });
});

app.get("/get-roblox-action", (req, res) => {
    if (actionQueue.length > 0) {
        const actionsToSend = [];
        const maxActions = 5;

        for (let i = 0; i < maxActions && actionQueue.length > 0; i++) {
            const actionToDo = actionQueue.shift();
            if (actionToDo && actionToDo.gift_name) {
                actionsToSend.push(actionToDo);
            }
        }

        console.log(`🚀 Wysyłanie ${actionsToSend.length} akcji do Roblox`);
        if (actionsToSend.length === 1) {
            res.json(actionsToSend[0]);
        } else {
            res.json({ actions: actionsToSend, count: actionsToSend.length });
        }
    } else {
        res.json({});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Serwer działa na porcie ${port}`);
});
