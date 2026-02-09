export const testScenarios = [
    {
        description: "Search by the valid keyword",
        category: "Wallpapers",
        keyword: "sport",
        expectedMinResult: 1
    },
    {
        description: "Search by the invalid keyword",
        category: "Wallpapers",
        keyword: "!)*)",
        expectedMinResult: 0
    }
]