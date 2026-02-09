export const searchScenarios = [
    {
        description: "Search by the valid keyword",
        category: "Wallpapers",
        keyword: "sport",
        expectedMinResults: 1
    },
    {
        description: "Search by the invalid keyword",
        category: "Wallpapers",
        keyword: "!)*)",
        expectedMinResults: 0
    }
]

export const verifyItemsScenarios = [
    {
        description: "Verify free and paid items",
        category: "Wallpapers",
        keyword: "nature",
        expectedMinSearchResults: 1,
        expectedMinFree: 1,
        expectedMinPremium: 1
    }
]