using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Posts;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<Post>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        // [Authorize]
        public async Task<ActionResult<Post>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id = id});
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create(Post post)
        {
            return Ok(await Mediator.Send(new Create.Command { Post = post }));
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Edit(Guid id, Post post)
        {
            post.Id = id;
            return Ok(await Mediator.Send(new Edit.Command { Post = post }));
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}