const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ================= THE DATA INVENTORY MATRIX LABELS =================
let vehicleInventoryDatabase = [
    {
        id: 1,
        title: "2017 Nissan GT-R Premium Edition",
        price: "KES 12,500,000",
        imageUrl: "https://images.unsplash.com/photo-1611245451551-3e3e3b1ba3fe?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,         // Toggle true to cast this car into the large top width hero banner workspace
        isImportVersion: true,     // Custom router context parameter layout mapping
        specs: {
            engine: "3.8L Twin Turbo V6",
            drive: "4WD System",
            mileage: "Low Certified Mileage",
            grade: "Auction Sheet Grade 4.5"
        }
    },
    {
        id: 2,
        title: "2021 Toyota Land Cruiser ZX",
        price: "KES 12,800,000",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        isImportVersion: false,   // Bound directly inside your 10 selected units horizontal browser deck slider
        specs: {
            mileage: "24,000 km",
            engine: "3.5L Twin-Turbo V6",
            transmission: "10-Speed Auto",
            fuel: "Petrol"
        }
    },
    {
        id: 3,
        title: "2019 Toyota Harrier Premium",
        price: "KES 6,250,000",
        imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        isImportVersion: false,
        specs: {
            mileage: "48,000 km",
            engine: "2.0L 4-Cylinder",
            transmission: "CVT Automatic",
            fuel: "Petrol"
        }
    },
    {
        id: 4,
        title: "2018 Toyota Prado TX-L",
        price: "KES 7,950,000",
        imageUrl: "https://images.unsplash.com/photo-1594568284297-7c64464062b1?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        isImportVersion: false,
        specs: {
            mileage: "56,000 km",
            engine: "2.7L VVTi Engine",
            transmission: "6-Speed Automatic",
            fuel: "Petrol"
        }
    },
    {
        id: 5,
        title: "2020 Lexus RX 300 F Sport",
        price: "KES 7,150,000",
        imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        isImportVersion: false,
        specs: {
            mileage: "31,000 km",
            engine: "2.0L Turbocharged",
            transmission: "6-Speed Automatic",
            fuel: "Petrol"
        }
    }
];

// APIS
app.get('/api/vehicles', (req, res) => {
    res.json(vehicleInventoryDatabase);
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/api/inquiry', async (req, res) => {
    const { car, name, phone, email, destination, notes } = req.body;

    const adminEmail = "your-email@jdmeastafrica.com"; 
    const japanSupplierEmail = "tokyo-desk@japan-partners.jp"; 

    const emailHtmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e5e7eb; padding: 0; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background-color: #111111; padding: 24px; text-align: center; border-bottom: 3px solid #0052CC;">
                <h2 style="color: #FFFFFF; margin: 0; font-size: 16px; font-weight: 800; letter-spacing: 2px;">JDM EAST AFRICA ROUTER ENGINE</h2>
            </div>
            <div style="padding: 24px; background-color: #FFFFFF;">
                <h3 style="color: #111111; margin-top: 0; font-size: 18px;">Target Match Request: ${car}</h3>
                <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
                <p style="font-size: 13px; color: #374151;"><strong>Client Profile Details:</strong></p>
                <ul style="font-size: 13px; color: #4b5563; line-height: 1.8;">
                    <li><strong>Full Name:</strong> ${name}</li>
                    <li><strong>WhatsApp Primary Phone:</strong> ${phone}</li>
                    <li><strong>Client Email Address:</strong> ${email}</li>
                    <li><strong>Designated Transit Delivery Port:</strong> ${destination || "On-Site Showroom Unit Stock Request Check"}</li>
                </ul>
                <div style="background-color: #f4f4f6; padding: 16px; border-left: 4px solid #0052CC; margin-top: 24px; border-radius: 2px;">
                    <p style="margin: 0; font-weight: 700; font-size: 11px; color: #111111; uppercase; tracking-wider;">Logistical Criteria Directives:</p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${notes}</p>
                </div>
            </div>
        </div>
    `;

    try {
        // Mail outbox step to Admin logs
        await transporter.sendMail({
            from: `"JDM Funnel Hub" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `[ADMIN CORE] New Lead Form Activity: ${car} - From ${name}`,
            html: emailHtmlTemplate
        });

        // Parallel mirror route step straight to Tokyo supplier base account
        await transporter.sendMail({
            from: `"JDM Sourcing Link" <${process.env.EMAIL_USER}>`,
            to: japanSupplierEmail,
            subject: `[JAPAN TRADE PARTNER REQ] Sourcing Allocation Profile Target: ${car}`,
            html: emailHtmlTemplate
        });

        res.status(200).json({ message: 'Routing successful.' });
    } catch (error) {
        console.error('SMTP Mail Distribution Matrix Halt Exception:', error);
        res.status(500).json({ error: 'Mail relay operational protocol array crash.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sourcing Marketplace Platform active on port ${PORT}`));
