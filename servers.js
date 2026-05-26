const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ================= VEHICLE REPOSITORY ARRAY DATABASE MATRIX =================
// Simply add, remove, change values, swap images, or toggle properties here. 
// The frontend UI layout handles updates automatically based on this state array.
let vehicleInventoryDatabase = [
    {
        id: 1,
        title: "2021 Porsche 911 Turbo S (992 Series)",
        price: "KES 24,500,000",
        imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80",
        isFeatured: true,        // Setting this to true instantly projects this car onto the main top Hero section
        isImportVersion: false,   // False keeps this asset bound safely inside the Local Showroom slider view
        specs: {
            mileage: "12,000 km",
            engine: "3.7L Twin-Turbo H6",
            transmission: "8-Speed PDK Automatic",
            fuel: "Petrol",
            color: "GT Silver Metallic",
            location: "Nairobi Showroom"
        }
    },
    {
        id: 2,
        title: "2020 Toyota Land Cruiser V8 ZX",
        price: "KES 14,800,000",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        isImportVersion: false,
        specs: {
            mileage: "42,000 km",
            engine: "4.6L V8 Dual VVT-i",
            transmission: "6-Speed Automatic",
            fuel: "Petrol",
            color: "Pearl White",
            location: "Mombasa Port Showroom"
        }
    },
    {
        id: 3,
        title: "2022 Mercedes-Benz AMG G63",
        price: "Inquire for Direct Japan Auction Target Price",
        imageUrl: "https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        isImportVersion: true,    // True categorizes this unit specifically as a Direct Japan Sourcing entry
        specs: {
            mileage: "8,500 km (Auction Grade 5A)",
            engine: "4.0L V8 Biturbo",
            transmission: "9-Speed AMG SPEEDSHIFT",
            fuel: "Petrol",
            color: "Obsidian Black",
            location: "Yokohama Terminal Port"
        }
    }
];

// ================= ENDPOINTS =================

// Endpoint for frontend to fetch the active inventory state dynamically
app.get('/api/vehicles', (req, res) => {
    res.json(vehicleInventoryDatabase);
});

// Primary Mail Relay Split-Routing Action
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/api/inquiry', async (req, res) => {
    const { car, type, name, phone, email, destination, notes } = req.body;

    const adminEmail = "your-email@maridadimotors.com"; 
    const japanSupplierEmail = "supplier@japan-car-auctions.co.jp"; 

    const emailHtmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
            <div style="background-color: #1A1A1A; padding: 16px; text-align: center; color: white;">
                <h2>MARIDADI MOTORS FUNNEL RECORD</h2>
            </div>
            <h3 style="color: #0052CC; margin-top: 20px;">Target Assignment: ${car}</h3>
            <p><strong>Lead Origin Classification:</strong> ${type}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>Customer Information:</strong></p>
            <ul>
                <li><strong>Client Name:</strong> ${name}</li>
                <li><strong>WhatsApp Contact:</strong> ${phone}</li>
                <li><strong>Email Address:</strong> ${email}</li>
                <li><strong>Destination Hub:</strong> ${destination || "Not specified / Showroom inquiry"}</li>
            </ul>
            <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #D1A12C; margin-top: 16px;">
                <p style="margin: 0; font-weight: bold;">Configuration Strategy Notes:</p>
                <p style="margin: 8px 0 0 0; color: #444;">${notes}</p>
            </div>
        </div>
    `;

    try {
        // Dispatch copy to your dashboard tracking matrix inbox
        await transporter.sendMail({
            from: `"Maridadi System Engine" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `[ADMIN CORE] Lead Notification: ${car} - ${name}`,
            html: emailHtmlContent
        });

        // Dispatch twin parallel mirror copy directly to Japan partner
        await transporter.sendMail({
            from: `"Maridadi Global Hub" <${process.env.EMAIL_USER}>`,
            to: japanSupplierEmail,
            subject: `[SUPPLIER AUCTION REQ] ${car} for ${name}`,
            html: emailHtmlContent
        });

        res.status(200).json({ message: 'Success. Split routing dispatched successfully.' });
    } catch (error) {
        console.error('SMTP Dispatch Network Interruption:', error);
        res.status(500).json({ error: 'Mail relay routing arrays mapping failure.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Maridadi Hub running securely on port ${PORT}`));
