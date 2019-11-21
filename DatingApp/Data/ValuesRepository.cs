using DatingApp.Models;

namespace DatingApp.Data
{
    public class ValuesRepository: GenericRepository<Value>,IValuesRepository
    {
        public ValuesRepository(DataContext _context):base(_context)
        {
            
        }
    }
}