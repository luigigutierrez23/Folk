using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {

            if(!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    },
                    
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                    
                    new AppUser
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (!context.Posts.Any())
            {
                var posts = new List<Post>
                {
                  new Post
                  {
                      Title = "Past Posts 1",
                      Date = DateTime.Now.AddMonths(-2),
                      Description = "Posts 2 months ago",
                      Category = "drinks",
                      City = "London",
                      Venue = "Pub",
                  },
                  new Post
                  {
                      Title = "Past Posts 2",
                      Date = DateTime.Now.AddMonths(-1),
                      Description = "Posts 1 month ago",
                      Category = "culture",
                      City = "Paris",
                      Venue = "Louvre",
                  },
                  new Post
                  {
                      Title = "Future Posts 1",
                      Date = DateTime.Now.AddMonths(1),
                      Description = "Posts 1 month in future",
                      Category = "culture",
                      City = "London",
                      Venue = "Natural History Museum",
                  },
                  new Post
                  {
                      Title = "Future Posts 2",
                      Date = DateTime.Now.AddMonths(2),
                      Description = "Posts 2 months in future",
                      Category = "music",
                      City = "London",
                      Venue = "O2 Arena",
                  },
                  new Post
                  {
                      Title = "Future Posts 3",
                      Date = DateTime.Now.AddMonths(3),
                      Description = "Posts 3 months in future",
                      Category = "drinks",
                      City = "London",
                      Venue = "Another pub",
                  },
                  new Post
                  {
                      Title = "Future Posts 4",
                      Date = DateTime.Now.AddMonths(4),
                      Description = "Posts 4 months in future",
                      Category = "drinks",
                      City = "London",
                      Venue = "Yet another pub",
                  },
                  new Post
                  {
                      Title = "Future Posts 5",
                      Date = DateTime.Now.AddMonths(5),
                      Description = "Posts 5 months in future",
                      Category = "drinks",
                      City = "London",
                      Venue = "Just another pub",
                  },
                  new Post
                  {
                      Title = "Future Posts 6",
                      Date = DateTime.Now.AddMonths(6),
                      Description = "Posts 6 months in future",
                      Category = "music",
                      City = "London",
                      Venue = "Roundhouse Camden",
                  },
                  new Post
                  {
                      Title = "Future Posts 7",
                      Date = DateTime.Now.AddMonths(7),
                      Description = "Posts 2 months ago",
                      Category = "travel",
                      City = "London",
                      Venue = "Somewhere on the Thames",
                  },
                  new Post
                  {
                      Title = "Future Posts 8",
                      Date = DateTime.Now.AddMonths(8),
                      Description = "Posts 8 months in future",
                      Category = "film",
                      City = "London",
                      Venue = "Cinema",
                  }  
                };

                context.Posts.AddRange(posts);
                context.SaveChanges();
            }
        }
    }
}