type TagsType = {
    value: string,
    label: string
}

const tags: string[] = [
    "African", "Asian", "Bagels", 'Baked Goods', 'BBQ', "Beer", "Beverages", "Bread", "Burgers", "BYO", "Cakes", "Catering", "Charcoal Chicken", "Charcuterie", "Cheeses", "Chinese", "Chocolate", 'Cider', 'Cocktails', 'Coffee', 'Coffee Beans', "Comedy", 'Confectionary', 'Continental', "Cookies", "Croissant", 'Deli Goods', 'Desserts', 'Doughnuts', 'Drive Thru', "Dumplings", 'English', "Ethiopian", 'European', "Filipino", 'Fine Dining', 'Fish & Chips', 'French', 'Fried Chicken', "Fries", 'Fromagerie', 'Fruit & Veggies', "Functions", 'German', 'Gin', 'Gluten Free', "Grazing Platters", 'Greek', 'Grill', 'Halal', 'Hampers', 'Ice Cream', 'Indian', 'Indonesian', 'Israeli', 'Italian', 'Japanese', 'Jewish', 'Kebab', "Kid Friendly", 'Kitchen', 'Korean', 'Kosher', 'Latin American', 'Lebanese', 'Licensed', "Liqueur", 'Live Music', 'Malaysian', "Margaritas", "Mead", 'Meats', 'Mediterranean', "Mexican", 'Middle Eastern', "Milkshakes", 'Modern Australian', "Nepalese", 'North American', 'Organic', 'Pakistani', 'Pantry Items', "Parma", 'Pasta', 'Pastries', "Pet Friendly", "Pies", 'Pizza', 'Plant Based', 'Pub Classics', "Ramen", 'Salads', 'Sandwiches', 'Seafood', 'South American', 'Souvlaki', 'Spanish', 'Spirits', 'Sri Lankan', "Steak", 'Sushi', "Tacos", "Taiwanese", 'Tapas', "Tea", "Tequila", 'Thai', 'Turkish', 'Vegan', 'Vegetarian', 'Vietnamese', "Vodka", 'Wholefoods', 'Whisky', 'Wine', 'Yum Cha']
const transformedTags: TagsType[] = tags.map((tag) => ({
    value: tag.toLowerCase(),
    label: tag
}));

export default transformedTags
