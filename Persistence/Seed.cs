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
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any() && !context.Posts.Any())
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
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }

                var activities = new List<Post>
                {
                    new Post
                    {
                        Title = "Past Post 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Post 2 months ago",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Post
                    {
                        Title = "Past Post 2",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Post 1 month ago",
                        Category = "culture",
                        City = "Paris",
                        Venue = "The Louvre",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Post 1 month in future",
                        Category = "music",
                        City = "London",
                        Venue = "Wembly Stadium",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Post 2 months in future",
                        Category = "food",
                        City = "London",
                        Venue = "Jamies Italian",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new PostsAttendee
                            {
                                AppUser = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Post 3 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = true                            
                            },
                            new PostsAttendee
                            {
                                AppUser = users[0],
                                IsHost = false                            
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Post 4 months in future",
                        Category = "culture",
                        City = "London",
                        Venue = "British Museum",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = true                            
                            }
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Post 5 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Punch and Judy",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[0],
                                IsHost = true                            
                            },
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Post 6 months in future",
                        Category = "music",
                        City = "London",
                        Venue = "O2 Arena",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[2],
                                IsHost = true                            
                            },
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Post 7 months in future",
                        Category = "travel",
                        City = "Berlin",
                        Venue = "All",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[0],
                                IsHost = true                            
                            },
                            new PostsAttendee
                            {
                                AppUser = users[2],
                                IsHost = false                            
                            },
                        }
                    },
                    new Post
                    {
                        Title = "Future Post 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Post 8 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<PostsAttendee>
                        {
                            new PostsAttendee
                            {
                                AppUser = users[2],
                                IsHost = true                            
                            },
                            new PostsAttendee
                            {
                                AppUser = users[1],
                                IsHost = false                            
                            },
                        }
                    }
                };

                await context.Posts.AddRangeAsync(activities);
                await context.SaveChangesAsync();
            }
        }
    }
}
