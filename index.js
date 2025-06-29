import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let posts = [];

// Home page
app.get("/", (req, res) => {
  res.render("home.ejs", { posts });
});

// Compose page
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

// About page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// Handle new post
app.post("/post", (req, res) => {
  const { author, title, content } = req.body;
  const date = new Date().toLocaleDateString();
  posts.push({ author, title, content, date });
  res.redirect("/");
});

// View a post
app.get("/posts", (req, res) => {
  const blogIndex = parseInt(req.query.blogIndex, 10);

  if (isNaN(blogIndex) || blogIndex < 0 || blogIndex >= posts.length) {
    res.status(404).send("Blog not found");
  } else {
    const blog = posts[blogIndex];
    const escapeHTML = (str) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const formattedContent = escapeHTML(blog.content).replace(/\n/g, "<br>");

    res.render("posts.ejs", {
      title: blog.title,
      date: blog.date,
      author: blog.author,
      content: formattedContent,
    });
  }
});

// Delete post
app.post("/delete", (req, res) => {
  const index = parseInt(req.body.index, 10);
  if (!isNaN(index) && index >= 0 && index < posts.length) {
    posts.splice(index, 1);
  }
  res.redirect("/");
});

// Show edit page
app.get('/edit', (req, res) => {
  const index = parseInt(req.query.index, 10);
  if (isNaN(index) || index < 0 || index >= posts.length) {
    return res.status(404).send("Post not found.");
  }

  const post = posts[index];
  res.render('edit.ejs', { post, index });
});

// Update post
app.post('/update', (req, res) => {
  const { index, author, title, content } = req.body;
  const postIndex = parseInt(index, 10);

  if (isNaN(postIndex) || postIndex < 0 || postIndex >= posts.length) {
    return res.status(400).send("Invalid index.");
  }

  posts[postIndex] = { author, title, content };
  res.redirect('/');
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Content in the home page
const blogs = [];
posts.push({
  title: "Invisible Code",
  author: "Abbas",
  content:
    "Chances are by the time you finish this paragraph an algorithm has already decided something for you, your next song, ad, post or notification. It happens constantly and quietly. We don’t see the code. We just follow its rhythm. I noticed this more clearly during a brief social media break. I wasn’t trying to “detox”, I just needed space. But even offline, I kept reaching for habits tech had built for me. I Googled aesthetic wallpapers. I scrolled old screenshots. I realized how deeply my daily actions were shaped by invisible systems. Algorithms aren’t evil. They’re smart. They help us find new music, dodge traffic even filter spam. But the more they personalize things, the more they blur the line between what we want and what we’re shown. From GPS to smart assistants, we’ve outsourced a lot of thinking to machines. Once a calendar glitch made me miss a meeting. I didn’t double check because I trusted the tech. That’s when it hit me: i’d stopped paying attention.",
  date: "March 1",
});

posts.push({
  title: "A Lost Hour",
  author: "Jana",
  content:
    "I didn’t mean to get lost. I just missed the tram stop.The plan was simple: ride the famous Tram 28 through Lisbon, hop off at the viewpoint, take some pictures and grab pastel de nata at a café a friend had recommended. But somewhere between looking out the window and trying to translate the stop names, I realized I had gone way too far. When I finally stepped off, I wasn’t in a place that looked like any of the tourist photos I’d bookmarked. No tile covered buildings. No scenic overlooks. Just a sleepy neighborhood, a quiet bakery and a couple of kids playing soccer in the street. My first instinct was to pull out my phone and map my way back. But my data had cut out, and for a second, I panicked. I had no clue where I was and I wasn’t thrilled about that. But then something shifted. I decided to walk. There was no destination anymore so I wandered. I watched a grandmother hang laundry while humming to herself. I passed a man carving wood outside a small workshop. I smelled bread. Warm, crusty and fresh bread the kind that makes you stop walking. I followed the scent to the bakery I’d seen earlier. No one inside spoke English but we laughed our way through ordering a roll and coffee. It cost less than a euro. It was one of the best things I ate in Lisbon. That accidental detour became my favorite hour of the trip. Not the planned castles. Not the guidebook gems. But that quiet street. That bakery. The unexpected calm of not knowing and realizing that was okay.",
  date: "September 6",
});

posts.push({
  title: "The Quiet Power",
  author: "Hiba",
  content:
    "We live in a time where everything is shared. Art, thoughts, workouts, meals even rest has become performative. I once posted a photo of my notebook and someone replied: “Wow, you’re so productive.” I was literally doodling. Somewhere along the way, the line between doing and being seen doing got blurry. And as someone who creates things  whether it’s writing, drawing, or just rearranging furniture, I started feeling like none of it mattered unless it was impressive, public, or followed by “likes.” But then something small changed that. A few months ago, I found an old folder on my computer titled “Random.” It was full of half written poems, design mockups, screenshots, notes and messy story ideas I’d completely forgotten about. No polish. No purpose. Just things I made because I felt like it. I spent hours reading through them, smiling. None of it was good in the traditional sense. But it was me. Honest, instinctive, unfiltered. It reminded me why I ever picked up a pen or opened a blank canvas to begin with because creating made me feel alive, not because it made me look productive.",
  date: "July 24",
});