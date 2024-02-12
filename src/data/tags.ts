type TagsType = {
    value: string,
    label: string
}

const tags: string[] = [
    "Asian", "Bagels", 'Baked Goods', 'BBQ', "Beer", "Beverages", "Bread", "Burgers", "BYO", "Cakes", "Catering", "Charcoal Chicken", "Cheeses", "Chinese", "Chocolate", 'Cider', 'Cocktails', 'Coffee', 'Coffee Beans', 'Confectionary', 'Continental', "Cookies", 'Deli Goods', 'Desserts', 'Doughnuts', 'Drive Thru', "Dumplings", 'English', 'European', "Filipino", 'Fine Dining', 'Fish & Chips', 'French', 'Fried Chicken', "Fries", 'Fromagerie', 'Fruit & Veggies', 'German', 'Gin', 'Gluten Free', "Grazing Platters", 'Greek', 'Grill', 'Halal', 'Hampers', 'Ice Cream', 'Indian', 'Indonesian', 'Israeli', 'Italian', 'Japanese', 'Jewish', 'Kebab', 'Kitchen', 'Korean', 'Kosher', 'Latin American', 'Lebanese', 'Licensed', "Liqueur", 'Live Music', 'Malaysian', "Margaritas", "Mead", 'Meats', 'Mediterranean', "Mexican", 'Middle Eastern', "Milkshakes", 'Modern Australian', 'North American', 'Organic', 'Pakistani', 'Pantry Items', 'Pasta', 'Pastries', 'Pizza', 'Plant Based', 'Pub Classics', "Ramen", 'Salads', 'Sandwiches', 'Seafood', 'South American', 'Souvlaki', 'Spanish', 'Spirits', 'Sri Lankan', 'Sushi', "Tacos", "Taiwanese", 'Tapas', "Tea", "Tequila", 'Thai', 'Turkish', 'Vegan', 'Vegetarian', 'Vietnamese', "Vodka", 'Wholefoods', 'Whisky', 'Wine', 'Yum Cha', "Charcuterie", "Pet Friendly", "Kid Friendly", 'Comedy', 'Functions', 'Pies', 'Parma', 'Steak', 'Croissant', 'Nepalese', 'African', 'Ethiopian', 'DJ', "Theatre"]
const transformedTags: TagsType[] = tags.map((tag) => ({
    value: tag.toLowerCase(),
    label: tag
}));
const sortedTags = transformedTags.slice().sort((a, b) => a.label.localeCompare(b.label));

export default sortedTags
