using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [ApiController]
   [Route("[controller]")]
    public class ValuesController: Controller
    {
        private readonly DataContext _context;

        public ValuesController(DataContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        [HttpGet("getValue")]
        public async Task<IActionResult> GetValue(){
            var value=await _context.Values.ToListAsync();
            return Ok(value);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id){
            var value=await _context.Values.FirstOrDefaultAsync(x=>x.Id==id);
            return Ok(value);
        }
    }
}