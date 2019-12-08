export interface Pagination {
    currentPage: number;
    iteamsPerPage: number;
    totalIteams: number;
    totalPages: number;
}
export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}
