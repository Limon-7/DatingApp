namespace DatingApp.Helper
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int IteamsPerPage { get; set; }
        public int TotalIteams { get; set; }
        public int TotalPages { get; set; }

        public PaginationHeader(int currentPage, int iteamsPerPage, int totalIteams, int totalPages)
        {
            this.CurrentPage = currentPage;
            this.IteamsPerPage = iteamsPerPage;
            this.TotalIteams = totalIteams;
            this.TotalPages = totalPages;
        }
    }
}