using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ValuesController : Controller
    {
        private readonly IValuesRepository _context;

        public ValuesController(IValuesRepository context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        [HttpGet("getValue")]
        public IActionResult GetValue()
        {
            var value = _context.GetAll();
            return Ok(value);
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id)
        {
            //      var v= new Value(){
            //      Name="Tarek"
            //     };
            //    await _context.Create(v);
            //  await _context.Delete(5);
            var value = await _context.GetById(id);
            return Ok(value);
        }


    }
}