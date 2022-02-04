using System.Collections.Generic;
using System.Linq;

namespace DatingApp.Helper
{
    public class Pagination<T> where T : class
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public IQueryable<T> Data { get; set; }

        public Pagination(int pageIndex, int pageSize, int count, IQueryable<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }
    }
}