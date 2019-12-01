using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PeopleController: Controller
    {
        //[HttpGet] 
        [HttpGet("all")]
    public ActionResult<IEnumerable<string>> GetAll()
    {
        return new string []
        {
            "limon","tarek","katappa"
        };
    }
    }
}