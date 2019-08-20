
export enum api {
    NOTIFY = '/notifications',
    USERS = '/users',
    GAMES = '/games',
    RUNS = '/runs',
    CATS = '/categories',
    SERIES = '/series',
    USER = '/users/:uid',
    RUN = '/runs/:rid',
    VARIABLE = '/variables/:vid',
    LEVEL = '/levels/:lid',
    CATEGORY = '/categories/:cid',
    GAME = '/games/:gid',
    LEADERBOARD_C = '/leaderboards/:gid/category/:cid',
    LEADERBOARD_L = '/leaderboards/:gid/level/:lid/:cid',
}