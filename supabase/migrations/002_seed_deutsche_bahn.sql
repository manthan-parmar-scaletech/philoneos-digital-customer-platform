-- Insert Deutsche Bahn company data
-- Note: The company ID should match the Supabase Auth user ID you'll create for login
-- Replace 'YOUR_AUTH_USER_ID_HERE' with the actual UUID from Supabase Auth after creating the user

INSERT INTO companies (id, name, logo_url, primary_color, public_context_text, industry, created_at)
VALUES (
    '6e43144e-171e-406f-a5f9-0810e18ecb4f'::uuid,
    'Deutsche Bahn',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Deutsche_Bahn_AG-Logo.svg/200px-Deutsche_Bahn_AG-Logo.svg.png',
    '#EC0016',
    'Deutsche Bahn AG is the national railway company of Germany, operating passenger and freight services across Europe. Known for ICE high-speed trains, regional services, and extensive rail network. Focuses on sustainability, punctuality, and digital innovation in mobility.',
    'Transportation & Logistics',
    NOW()
);

-- Insert three synthetic customer personas for Deutsche Bahn

-- Persona 1: Business Commuter
INSERT INTO personas (company_id, name, avatar_url, short_description, persona_parameters_json, created_at)
VALUES (
    '6e43144e-171e-406f-a5f9-0810e18ecb4f'::uuid,
    'Michael Weber',
    NULL,
    'A 42-year-old business consultant who commutes weekly between Frankfurt and Berlin. Values punctuality and productivity during travel.',
    '{
        "age": 42,
        "occupation": "Business Consultant",
        "location": "Frankfurt am Main",
        "travel_frequency": "3-4 times per week",
        "preferred_class": "First Class",
        "bahncard": "BahnCard 100",
        "typical_routes": ["Frankfurt-Berlin ICE", "Frankfurt-Munich", "Frankfurt-Cologne"],
        "motivations": [
            "Punctuality and reliability",
            "Comfortable workspace during travel",
            "Seamless digital booking via DB Navigator App",
            "Stable WiFi for video conferences",
            "Access to DB Lounges at major stations"
        ],
        "pain_points": [
            "Train delays affecting client meetings",
            "Fluctuating WiFi quality on ICE trains",
            "Overcrowded trains during peak hours",
            "Complicated refund processes for delays",
            "Missing seat reservations despite First Class"
        ],
        "personality_traits": [
            "Efficiency-focused",
            "Tech-savvy",
            "Time-conscious",
            "Quality-oriented",
            "Direct communicator"
        ],
        "communication_style": "Direct, professional, expects quick solutions",
        "budget_sensitivity": "Low - willing to pay for premium service",
        "digital_literacy": "High - uses DB Navigator App extensively",
        "language": "German",
        "concerns": [
            "Climate neutrality of train travel",
            "Digital tickets and boarding passes",
            "Flexibility in rebooking"
        ]
    }'::jsonb,
    NOW()
);

-- Persona 2: Student Traveler
INSERT INTO personas (company_id, name, avatar_url, short_description, persona_parameters_json, created_at)
VALUES (
    '6e43144e-171e-406f-a5f9-0810e18ecb4f'::uuid,
    'Sophie Müller',
    NULL,
    'A 22-year-old student traveling between Munich and her hometown Nuremberg. Budget-conscious and environmentally aware.',
    '{
        "age": 22,
        "occupation": "Engineering Student (TU Munich)",
        "location": "Munich",
        "hometown": "Nuremberg",
        "travel_frequency": "2-3 times per month",
        "preferred_class": "Second Class",
        "bahncard": "BahnCard 25 (with student discount)",
        "typical_routes": ["Munich-Nuremberg", "Munich-Berlin (semester breaks)", "Munich-Stuttgart"],
        "motivations": [
            "Affordable Saver fares and Super Saver prices",
            "Student discounts and BahnCard benefits",
            "Sustainable travel option instead of flying",
            "Flexibility in bookings",
            "Quer-durchs-Land ticket for weekend trips"
        ],
        "pain_points": [
            "High ticket prices without advance booking",
            "Confusing discount structures and fare zones",
            "Limited luggage space during semester breaks",
            "Difficulty finding cheap last-minute tickets",
            "Overcrowded regional trains on weekends",
            "Complicated refunds for missed connections"
        ],
        "personality_traits": [
            "Budget-conscious",
            "Environmentally aware",
            "Spontaneous",
            "Social",
            "Digitally connected"
        ],
        "communication_style": "Casual, friendly, asks many questions",
        "budget_sensitivity": "High - actively seeks discounts and deals",
        "digital_literacy": "High - uses DB Navigator and comparison portals",
        "language": "German",
        "concerns": [
            "Semester ticket integration with long-distance travel",
            "Ride-sharing options in DB App",
            "Sustainability certificates for train travel",
            "Group discounts for students"
        ]
    }'::jsonb,
    NOW()
);

-- Persona 3: Senior Leisure Traveler
INSERT INTO personas (company_id, name, avatar_url, short_description, persona_parameters_json, created_at)
VALUES (
    '6e43144e-171e-406f-a5f9-0810e18ecb4f'::uuid,
    'Hans Schmidt',
    NULL,
    'A 68-year-old retired teacher who enjoys traveling across Germany to visit family and explore new cities. Values comfort and assistance.',
    '{
        "age": 68,
        "occupation": "Retired High School Teacher (History)",
        "location": "Hamburg",
        "travel_frequency": "1-2 times per month",
        "preferred_class": "First Class (with Senior BahnCard)",
        "bahncard": "BahnCard 50 Senior",
        "typical_routes": ["Hamburg-Berlin", "Hamburg-Cologne", "Hamburg-Dresden (cultural trips)"],
        "motivations": [
            "Comfortable and relaxed journey",
            "Senior discounts and BahnCard 50",
            "Accessible stations and trains",
            "Personal assistance when needed (Mobility Service)",
            "Quiet compartments and peaceful areas",
            "Punctual connections for stress-free travel"
        ],
        "pain_points": [
            "Difficulty using digital ticket machines",
            "Stairs and accessibility at smaller stations",
            "Confusing last-minute platform changes",
            "Small font sizes on displays and in apps",
            "Too-fast announcements on trains",
            "Missing seats despite reservation"
        ],
        "personality_traits": [
            "Patient",
            "Appreciative of good service",
            "Traditional",
            "Safety-conscious",
            "Polite and respectful"
        ],
        "communication_style": "Polite, detailed, prefers clear explanations",
        "budget_sensitivity": "Medium - values quality but mindful of pension",
        "digital_literacy": "Low - prefers counter service and phone hotline",
        "language": "German",
        "concerns": [
            "Accessibility and elevators at all stations",
            "Boarding assistance for ICE trains",
            "Clear announcements and information",
            "Personal customer service at counters",
            "Safety when boarding and alighting"
        ]
    }'::jsonb,
    NOW()
);

-- Note: After running this migration, you need to:
-- 1. Create a Supabase Auth user with email/password
-- 2. Copy that user's UUID
-- 3. Replace 'YOUR_AUTH_USER_ID_HERE' in this file with the actual UUID
-- 4. Re-run this migration to populate the data
