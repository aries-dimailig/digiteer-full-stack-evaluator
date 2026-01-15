using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using TaskManager.Models;
using TaskManager.Data;

namespace UserManager.API
{
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _context.Users
            .Include(u => u.Tasks)
            .Select(u => new User
            {
                Id = u.Id,
                Email = u.Email,
                PasswordHash = u.PasswordHash,
                Tasks = u.Tasks.Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsDone = t.IsDone,
                }).ToList()
            })
            .ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}")] 
        public async Task<IActionResult> Update(int id, [FromBody] User updated)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Email = updated.Email;
            user.PasswordHash = updated.PasswordHash;
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Tasks.RemoveRange(_context.Tasks.Where(t => t.UserId == id));

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}