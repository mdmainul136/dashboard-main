import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Eye, Plus, Globe, CheckCircle2 } from "lucide-react";

interface StorePage {
  id: string;
  title: string;
  type: "about" | "contact" | "policy" | "faq" | "custom";
  status: "published" | "draft";
  channels: string[];
  lastUpdated: string;
}

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  status: "published" | "draft";
  channel: string;
}

const mockPages: StorePage[] = [
  { id: "p1", title: "About Us", type: "about", status: "published", channels: ["Shopify", "Salla"], lastUpdated: "2026-02-15" },
  { id: "p2", title: "Contact Us", type: "contact", status: "published", channels: ["Shopify", "Salla"], lastUpdated: "2026-02-10" },
  { id: "p3", title: "Refund Policy", type: "policy", status: "published", channels: ["Shopify"], lastUpdated: "2026-01-20" },
  { id: "p4", title: "Privacy Policy", type: "policy", status: "published", channels: ["Shopify", "Salla"], lastUpdated: "2026-01-15" },
  { id: "p5", title: "FAQ", type: "faq", status: "published", channels: ["Shopify"], lastUpdated: "2026-02-01" },
  { id: "p6", title: "Shipping Info", type: "custom", status: "draft", channels: [], lastUpdated: "2026-02-18" },
];

const mockPosts: BlogPost[] = [
  { id: "b1", title: "Top 10 Gadgets for 2026", author: "Ahmed", date: "2026-02-18", views: 1245, status: "published", channel: "Shopify" },
  { id: "b2", title: "How to Choose the Right Mouse", author: "Sara", date: "2026-02-14", views: 890, status: "published", channel: "Shopify" },
  { id: "b3", title: "Office Setup Guide", author: "Ahmed", date: "2026-02-10", views: 567, status: "published", channel: "Salla" },
  { id: "b4", title: "Upcoming Product Launch", author: "Sara", date: "2026-02-19", views: 0, status: "draft", channel: "Shopify" },
];

const PagesAndBlog = () => {
  const [pages, setPages] = useState(mockPages);
  const [posts, setPosts] = useState(mockPosts);
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", content: "" });
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const totalPages = pages.length;
  const publishedPosts = posts.filter(p => p.status === "published").length;
  const totalViews = posts.reduce((s, p) => s + p.views, 0);

  const createPage = () => {
    if (!newPage.title) return;
    setPages(prev => [...prev, { id: `p${Date.now()}`, title: newPage.title, type: "custom", status: "draft", channels: [], lastUpdated: new Date().toISOString().slice(0, 10) }]);
    setNewPage({ title: "", content: "" });
    setPageDialogOpen(false);
  };

  const createPost = () => {
    if (!newPost.title) return;
    setPosts(prev => [...prev, { id: `b${Date.now()}`, title: newPost.title, author: "Admin", date: new Date().toISOString().slice(0, 10), views: 0, status: "draft", channel: "Shopify" }]);
    setNewPost({ title: "", content: "" });
    setPostDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Pages</p><p className="text-2xl font-bold text-foreground">{totalPages}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Published Posts</p><p className="text-2xl font-bold text-foreground">{publishedPosts}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><BookOpen className="h-5 w-5 text-success" /></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Views</p><p className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Eye className="h-5 w-5 text-violet-500" /></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages" className="gap-1.5"><FileText className="h-4 w-4" /> Pages</TabsTrigger>
          <TabsTrigger value="blog" className="gap-1.5"><BookOpen className="h-4 w-4" /> Blog Posts</TabsTrigger>
        </TabsList>

        {/* Pages */}
        <TabsContent value="pages" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{pages.length} store pages</p>
            <Button size="sm" className="gap-2" onClick={() => setPageDialogOpen(true)}><Plus className="h-4 w-4" /> Create Page</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Page</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Channels</th><th className="p-4 font-medium">Updated</th>
                </tr></thead>
                <tbody>
                  {pages.map(p => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{p.title}</td>
                      <td className="p-4 capitalize text-muted-foreground">{p.type}</td>
                      <td className="p-4">{p.status === "published" ? <Badge className="bg-success/10 text-success border-success/20">Published</Badge> : <Badge variant="outline">Draft</Badge>}</td>
                      <td className="p-4"><div className="flex gap-1">{p.channels.length > 0 ? p.channels.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>) : <span className="text-muted-foreground text-xs">—</span>}</div></td>
                      <td className="p-4 text-muted-foreground">{p.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Blog */}
        <TabsContent value="blog" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{posts.length} blog posts</p>
            <Button size="sm" className="gap-2" onClick={() => setPostDialogOpen(true)}><Plus className="h-4 w-4" /> Create Post</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Title</th><th className="p-4 font-medium">Author</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Views</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Channel</th>
                </tr></thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{p.title}</td>
                      <td className="p-4 text-foreground">{p.author}</td>
                      <td className="p-4 text-muted-foreground">{p.date}</td>
                      <td className="p-4 font-mono text-foreground">{p.views.toLocaleString()}</td>
                      <td className="p-4">{p.status === "published" ? <Badge className="bg-success/10 text-success border-success/20">Published</Badge> : <Badge variant="outline">Draft</Badge>}</td>
                      <td className="p-4"><Badge variant="outline">{p.channel}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Page Dialog */}
      <Dialog open={pageDialogOpen} onOpenChange={setPageDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Page</DialogTitle><DialogDescription>Add a new store page</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Page Title</Label><Input value={newPage.title} onChange={e => setNewPage(p => ({ ...p, title: e.target.value }))} placeholder="e.g. About Us" /></div>
            <div><Label>Content</Label><Textarea value={newPage.content} onChange={e => setNewPage(p => ({ ...p, content: e.target.value }))} placeholder="Page content..." rows={4} /></div>
          </div>
          <DialogFooter><Button onClick={createPage}>Create Page</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Blog Post</DialogTitle><DialogDescription>Write a new blog post</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Post Title</Label><Input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Product Review" /></div>
            <div><Label>Content</Label><Textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} placeholder="Post content..." rows={4} /></div>
          </div>
          <DialogFooter><Button onClick={createPost}>Publish Post</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PagesAndBlog;
