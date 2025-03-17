interface HotRankTab {
    name: string; // 模块名称
    tid: number; // 分类 ID
    slug: string; // 唯一标识符
    type?: string; // 可选：模块类型
    season_type?: number; // 可选：季节类型
    rank_type?: string; // 可选：排名类型
}

declare const hotRankTabs: HotRankTab[];

export default hotRankTabs;