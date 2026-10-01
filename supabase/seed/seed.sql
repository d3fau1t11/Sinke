-- Seed data for Senik database
-- Based on mockData.js from the original Sinke app

-- Insert zones
insert into zones (id, name_am, name_en, subcity_am, subcity_en, delivery_fee, delivery_eta) values
  ('koye-feche', 'ኮዬ ፈጬ', 'Koye Feche', 'አቃቂ ቃሊቲ ክፍለ ከተማ', 'Akaki Kality Subcity', 40, '20-30 min'),
  ('tuludimtu', 'ቱሉ ዲምቱ', 'Tuludimtu', 'አቃቂ ቃሊቲ / ቱሉ ዲምቱ', 'Akaki Kality / Tuludimtu Area', 45, '25-35 min'),
  ('akaki-kality', 'አቃቂ ቃሊቲ', 'Akaki Kality', 'ዋናው አቃቂ የንግድ ማዕከል', 'Central Akaki Commercial Zone', 35, '15-25 min');

-- Insert categories
insert into categories (id, name_am, name_en, icon, color, sort_order) values
  ('food', 'ምግብ', 'Food', 'restaurant', '#a73400', 1),
  ('groceries', 'ሸቀጥ', 'Groceries', 'shopping_basket', '#1b6d24', 2),
  ('pharmacy', 'የሕክምና', 'Pharmacy', 'local_pharmacy', '#aa6400', 3),
  ('drinks', 'መጠጥና ቡና', 'Drinks & Coffee', 'coffee', '#693c00', 4),
  ('butchery', 'ሥጋና ጥብስ', 'Meat & Tibs', 'lunch_dining', '#822700', 5),
  ('bakery', 'ዳቦና ኬክ', 'Bakery & Cakes', 'bakery_dining', '#aa6400', 6);

-- Insert businesses
insert into businesses (id, name_am, name_en, description_am, description_en, category, zone_id, cover_image, avatar_image, rating, reviews_count, delivery_eta, delivery_fee, is_halal, is_fasting_friendly, featured, latitude, longitude) values
  ('biz-1', 'ቤተ ጥብስ እና ክትፎ', 'Bete Tibs & Kitfo', 'ትኩስና ጥራት ያለው የበሬ እና የበግ ጥብስ፣ ልዩ ክትፎ ከአይብና ጎመን ጋር።', 'Authentic sizzling beef & lamb tibs, Gurage kitfo with ayib and gomen.', 'food', 'koye-feche', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80', 4.8, 342, '20-30 min', 40, true, false, true, 9.0522, 38.7468),
  ('biz-2', 'አባ ሻሎም የሀበሻ ምግብ', 'Abba Shalom Habesha Food', 'ተወዳጅ የሸክላ ሽሮ ፈሰስ፣ የፆም በያይነቱ፣ የድንች ፍርፍር እና ልዩ ቅቅል ወጥ።', 'Famous claypot Shiro tegabino, rich vegan Beyaynetu, and fresh firfir.', 'food', 'tuludimtu', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80', 4.9, 489, '15-25 min', 35, true, true, true, 9.0456, 38.7523),
  ('biz-3', 'ቶሞካ ቡና እና ቁርስ ቤት', 'Tomoca Buna & Traditional Breakfast', 'የተቆላ እውነተኛ የሀገር ቡና፣ ማኪያቶ፣ ጨጨብሳ በቅቤና ማር።', 'Freshly roasted Ethiopian coffee, creamy macchiato, Chechebsa with butter and honey.', 'drinks', 'akaki-kality', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80', 4.9, 620, '10-20 min', 30, true, true, true, 9.0389, 38.7612),
  ('biz-4', 'ሰላም ሱፐርማርኬት እና ቅመማቅመም', 'Selam Supermarket & Spices', 'የጠራ የጤፍ ዱቄት፣ ንጹህ ቅቤ፣ በርበሬ፣ ዘይት።', 'Clean pure Magna Teff flour, spiced butter, berbere, cooking oil.', 'groceries', 'koye-feche', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=200&q=80', 4.7, 215, '20-35 min', 40, true, true, false, 9.0534, 38.7489),
  ('biz-5', 'ብርሃን ፋርማሲ', 'Berhan Neighborhood Pharmacy', 'የታዘዙ መድሃኒቶች፣ የህመም ማስታገሻዎች፣ የህጻናት ንፅህና መጠበቂያ እና ቫይታሚኖች።', 'Prescription medications, pain relief, baby formula, first aid and vitamins.', 'pharmacy', 'tuludimtu', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=200&q=80', 4.9, 154, '15-20 min', 30, true, true, false, 9.0467, 38.7534),
  ('biz-6', 'ዳሽን ጥብስ እና ሥጋ ቤት', 'Dashin Butchery & Grill', 'የተመረጠ የበሬ ፍርምባ፣ ቁርጥ፣ ቋንጣ ጥብስ እና የተዘጋጀ ሚጥሚጣና አዋዜ።', 'Prime beef cuts, fresh Derek Tibs, Quanta Firfir and homemade mitmita.', 'butchery', 'akaki-kality', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=200&q=80', 4.8, 310, '20-30 min', 40, true, false, false, 9.0401, 38.7623),
  ('biz-7', 'መዓዛ የባህል ዳቦና ኬክ', 'Meaza Habesha Bakery & Cakes', 'ትኩስ የሸክላ አምባሻ፣ የሀበሻ ዳቦ፣ ሳንቡሳ፣ ዶናት እና የልደት ኬኮች።', 'Freshly baked warm Ambasha, traditional wheat bread, crispy Sambusa and cakes.', 'bakery', 'koye-feche', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&q=80', 4.7, 180, '15-25 min', 30, true, true, false, 9.0545, 38.7501),
  ('biz-8', 'ዮርዳኖስ ትኩስ አትክልትና ፍራፍሬ', 'Yordanos Fresh Veggies & Fruit', 'የተመረጠ ቲማቲም፣ ቀይ ሽንኩርት፣ ቃሪያ፣ ሙዝ፣ አቮካዶ እና ፓፓያ።', 'Farm-fresh tomatoes, red onions, green peppers, avocado and fresh fruits.', 'groceries', 'koye-feche', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80', 4.6, 140, '15-25 min', 35, true, true, false, 9.0556, 38.7512);

-- Insert products
insert into products (id, business_id, name_am, name_en, description_am, description_en, category, price, image, is_fasting, popular) values
  ('prod-1', 'biz-1', 'ልዩ የበሬ ለጋ ጥብስ', 'Special Beef Lega Tibs', 'በትኩስ ሰንጋ ሥጋ በቅቤ፣ በሽንኩርት፣ ሮዝመሪ እና በቃሪያ የተጠበሰ ለስላሳ ጥብስ ከ2 እንጀራ ጋር።', 'Tender pan-seared prime beef cubes sauteed with onions, rosemary, garlic and jalapenos.', 'food', 420, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', false, true),
  ('prod-2', 'biz-1', 'የጉራጌ ልዩ ክትፎ', 'Gurage Special Kitfo', 'በተመረጠ ቀይ ሥጋ፣ በኮረሪማ፣ በልዩ አንጥረኛ ቅቤ የተዘጋጀ ክትፎ ከአይብና ጎመን ጋር።', 'Finely minced lean beef seasoned with spiced clarified butter, korarima, and mitmita.', 'food', 460, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', false, true),
  ('prod-3', 'biz-1', 'የበግ ደረቅ ጥብስ', 'Crispy Derek Lamb Tibs', 'በደንብ የተጠበሰ ጥርት ያለ የበግ ሥጋ በከሰል ጣዕም ከአዋዜና ሰላጣ ጋር።', 'Crispy grilled seasoned lamb chunks served on a sizzling clay plate with spicy awaze and salad.', 'food', 450, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', false, false),
  ('prod-4', 'biz-2', 'የሸክላ ሽሮ ፈሰስ', 'Claypot Tegabino Shiro', 'የተመረጠ የሰሜን ሽሮ ዱቄት በሚንተከተክ ሸክላ በነጭ ሽንኩርትና በቃሪያ የተሰራ ትኩስ ሽሮ።', 'Bubbling, seasoned chickpea flour stew simmered with garlic, berbere, and fresh green chili.', 'food', 220, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', true, true),
  ('prod-5', 'biz-2', 'የፆም በያይነቱ', 'Traditional Vegan Beyaynetu Platter', 'ምስር ወጥ፣ አልጫ ክክ፣ ጎመን፣ አትክልት፣ ቀይ ስር፣ ቲማቲም ሰላጣ እና ሽሮ በአንድ ሰፊ እንጀራ ላይ።', 'A colorful feast of red lentil wot, yellow split peas, collard greens, beetroot, cabbage, and shiro atop teff injera.', 'food', 280, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', true, true),
  ('prod-6', 'biz-2', 'የቋንጣ ፍርፍር', 'Special Beef Quanta Firfir', 'የደረቀ የበሬ ቋንጣ ሥጋ በሚጣፍጥ የበርበሬ ወጥና በእንጀራ ተለውሶ በቅቤና በቃሪያ የተዘጋጀ።', 'Shredded sun-dried beef jerky slow-simmered in spicy berbere stew and rolled with torn teff injera.', 'food', 360, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', false, true),
  ('prod-7', 'biz-3', 'ስፔሻል ጨጨብሳ በቅቤና ማር', 'Special Chechebsa with Butter & Honey', 'የተፈተፈተ ቀጭን ቂጣ በሀገርኛ ንጥር ቅቤ፣ በርበሬ እና በተፈጥሮ ማር የተዘጋመ ከእርጎ ጋር።', 'Torn pieces of freshly baked flatbread pan-fried in rich spiced butter and berbere, drizzled with pure honey & yogurt.', 'drinks', 240, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', false, true),
  ('prod-8', 'biz-3', 'ቶሞካ ስፔሻል ማኪያቶ', 'Tomoca Signature Macchiato', 'በደረጃ 1 የይርጋጨፌ ቡና የተዘጋመ ወፍራም ክሬም ያለው እውነተኛ የኢትዮጵያ ማኪያቶ።', 'Authentic double-shot Yirgacheffe espresso topped with velvety steamed local milk foam.', 'drinks', 65, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', false, true),
  ('prod-9', 'biz-3', 'ልዩ ፉል ስፔሻል', 'Special Ful with Boiled Egg & Cheese', 'የተቀቀለ የባቄላ ፉል በቲማቲም፣ ቃሪያ፣ ሽንኩርት፣ አይብ፣ እንቁላል እና ንጹህ የሰንጥ ዘይት ከትኩስ ዳቦ ጋር።', 'Mashed fava beans topped with chopped tomatoes, onion, green chili, boiled egg, feta/ayib cheese and crusty bread roll.', 'food', 190, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', false, false),
  ('prod-10', 'biz-4', 'የማኛ ጤፍ ዱቄት 10 ኪሎ', 'Pure Magna White Teff Flour 10kg', 'የተመረጠ የደብረዘይት ማኛ ጤፍ በጥንቃቄ የተፈጨ ንጹህ ዱቄት ለስላሳ እንጀራ የሚወጣው።', 'Finest quality Debre Zeit pure Magna white teff grain, cleaned and milled for fluffy injera.', 'groceries', 1150, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', true, true),
  ('prod-11', 'biz-4', 'የተነጠረ የቅቤ በርበሬ 1 ኪሎ', 'Traditional Spiced Berbere Blend 1kg', 'በኮረሪማ፣ ነጭ ሽንኩርት እና በቅመማቅመም በባህላዊ መንገድ የተዘጋመ ቀይ የደብረማርቆስ በርበሬ።', 'Authentic slow-sun-dried red chili pepper blend mixed with korarima, garlic, ginger, and sacred spices.', 'groceries', 480, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true, true),
  ('prod-12', 'biz-4', 'የሱፍ የምግብ ዘይት 5 ሊትር', 'Pure Sunflower Cooking Oil 5L', 'ንጹህ የተጣራ የሱፍ ዘይት ለምግብ ማብሰያ እና መጥበሻ።', 'Pure refined sunflower cooking oil, light and cholesterol free for family kitchen cooking.', 'groceries', 890, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', true, false),
  ('prod-13', 'biz-5', 'ፓራሲታሞል ፓናዶል', 'Panadol Extra Pain Relief 24ct', 'ለራስ ምታት፣ ትኩሳትና ለሰውነት ህመም ፈጣን ማስታገሻ።', 'Fast-acting formula for headache, fever, muscle aches and flu symptom relief.', 'pharmacy', 180, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', true, true),
  ('prod-14', 'biz-5', 'ቫይታሚን ሲ 1000mg', 'Effervescent Vitamin C 1000mg + Zinc', 'የሰውነት በሽታ የመከላከል አቅምን የሚያጎለብት የሚሟሟ የብርቱካን ፅላት 20 ኪኒን።', 'Dissolvable fizzy orange tablets to boost natural immunity and vitality 20 pack.', 'pharmacy', 340, 'https://images.unsplash.com/photo-1550572017-ed240d866a42?auto=format&fit=crop&w=600&q=80', true, false),
  ('prod-15', 'biz-7', 'ትኩስ የሸክላ አምባሻ', 'Traditional Cardamom Ambasha Bread', 'በባህላዊ የሸክላ ምጣድ በኮረሪማ እና በዘቢብ የተጋገረ ትልቅ ክብ አምባሻ ለቤተሰብ።', 'Large circular traditional spiced bread with decorative wheel scoring, flavored with cardamom & raisins.', 'bakery', 120, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', true, true),
  ('prod-16', 'biz-7', 'የስንዴ ዳቦ እሽግ 5 ማዘገጃ', 'Fresh Sourdough Bread Rolls 5 pack', 'በየማለዳው ትኩስ የሚወጣ ጥርት ያለ ለስላሳ የስንዴ ዳቦ።', 'Daily baked warm golden wheat rolls, crusty outside and pillow soft inside.', 'bakery', 85, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80', true, false),
  ('prod-17', 'biz-1', 'አምቦ ውሀ 500ml', 'Original Ambo Sparkling Mineral Water', 'ከተፈጥሮ ምንጭ የተቀዳ ቀዝቃዛ የታሸገ የተፈጥሮ ጋዝ ያለው አምቦ ውሀ።', 'Naturally sparkling Ethiopian mineral water straight from the therapeutic springs of Ambo.', 'drinks', 45, 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=600&q=80', true, false),
  ('prod-18', 'biz-2', 'አቮካዶና ማንጎ ስፕሪስ ጭማቂ', 'Layered Avocado & Mango Spris Juice', 'ትኩስ የሀበሻ አቮካዶና ጣፋጭ ማንጎ ንብርብር ጭማቂ በሎሚና ቪምቶ ጠብታ።', 'Thick layers of ripe avocado puree and sun-sweet mango juice with a squeeze of fresh lime.', 'drinks', 130, 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80', true, true);

-- Insert product options
insert into product_options (product_id, name_am, name_en, price, is_required, sort_order) values
  ('prod-1', 'ተጨማሪ እንጀራ', 'Extra Injera', 20, false, 1),
  ('prod-1', 'በቅቤ ይበልጥ ይለዝብ', 'Extra Niter Kibbeh', 35, false, 2),
  ('prod-1', 'ሚጥሚጣና ሰናፍጭ', 'Extra Mitmita & Mustard', 0, false, 3),
  ('prod-2', 'ጥሬ (Raw)', 'Raw (Tire)', 0, false, 1),
  ('prod-2', 'ለብለብ (Lightly Warmed)', 'Leb-Leb (Lightly Warmed)', 0, false, 2),
  ('prod-2', 'ሙሉ በሙሉ የበሰለ (Well Done)', 'Well Done', 0, false, 3),
  ('prod-2', 'ተጨማሪ ቆጮ', 'Add Kocho Slice', 40, false, 4),
  ('prod-3', 'ተጨማሪ እንጀራ', 'Extra Injera', 20, false, 1),
  ('prod-3', 'አዋዜ በጎን', 'Side of Awaze', 0, false, 2),
  ('prod-4', 'በዘይት (የፆም)', 'Fasting with Oil', 0, false, 1),
  ('prod-4', 'በቅቤ (የፍስክ)', 'With Spiced Butter', 30, false, 2),
  ('prod-4', 'ተጨማሪ ቃሪያና ቲማቲም', 'Extra Chili & Tomato', 10, false, 3),
  ('prod-5', 'ተጨማሪ እንጀራ', 'Extra Injera', 20, false, 1),
  ('prod-5', 'ሱፍ ፍትፍት በጎን', 'Side of Suf Fitfit', 35, false, 2),
  ('prod-6', 'በእንቁላል የታሸገ', 'Add Scrambled Egg', 30, false, 1),
  ('prod-6', 'በአይብ የተሸፈነ', 'Top with Ayib Cheese', 35, false, 2),
  ('prod-7', 'በእንቁላል ጨምር', 'Add Fried Egg', 25, false, 1),
  ('prod-7', 'ተጨማሪ ማር', 'Extra Honey', 20, false, 2),
  ('prod-8', 'ያለ ስኳር (No Sugar)', 'No Sugar', 0, false, 1),
  ('prod-8', 'መካከለኛ ስኳር (Medium Sugar)', 'Medium Sugar', 0, false, 2),
  ('prod-8', 'የአኩሪ አተር ወተት (Soya Fasting Milk)', 'Soya/Fasting Milk', 15, false, 3),
  ('prod-9', 'የፆም (በዘይት ብቻ)', 'Fasting Option (Vegan)', 0, false, 1),
  ('prod-9', 'ተጨማሪ ትኩስ ዳቦ', 'Extra Fresh Bread', 15, false, 2),
  ('prod-15', 'በዘቢብ (With Raisins)', 'With Raisins', 15, false, 1),
  ('prod-15', 'ተራ (Plain)', 'Plain Classic', 0, false, 2);

-- Insert promo codes
insert into promo_codes (code, title_am, title_en, description_am, description_en, discount_percent, max_discount, min_order, valid_from, valid_until, is_active, usage_limit, usage_count) values
  ('SENIK15', 'የመጀመሪያ ትዕዛዝ 15% ቅናሽ!', '15% OFF Your First Order!', 'በኮድ SENIK15 ፈጣን ማድረሻ ያግኙ', 'Use code SENIK15 for instant discount', 15, 200, 0, '2024-01-01', '2026-12-31', true, 1000, 0),
  ('BUNA20', 'የማለዳ የቡናና ቁርስ ኤክስፕረስ', 'Morning Buna & Breakfast Express', 'ከጠዋቱ 1:00 ጀምሮ በ20 ደቂቃ ውስጥ', 'Fresh Chechebsa & Macchiato in 20 mins', 10, 100, 0, '2024-01-01', '2026-12-31', true, 500, 0),
  ('FREEDEL', 'የኮንዶሚኒየም ነጻ ማድረሻ ረቡዕ', 'Free Condo Delivery Wednesdays', 'ከ500 ብር በላይ ለሆኑ የሸቀጥ ትዕዛዞች', 'On grocery orders over 500 ETB', 0, 0, 500, '2024-01-01', '2026-12-31', true, 2000, 0);