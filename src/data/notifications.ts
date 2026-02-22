export type NotificationType = "order" | "stock" | "system" | "staff" | "payment" | "lms-course" | "lms-badge" | "lms-streak" | "lms-quiz" | "lms-certificate";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

const now = new Date();
function ago(minutes: number) {
  return new Date(now.getTime() - minutes * 60000).toISOString();
}

const initialNotifications: Notification[] = [
  { id: "n1", title: "New Order #1042", message: "আহমেদ হাসান placed an order for ৳3,450", type: "order", read: false, createdAt: ago(2) },
  { id: "n2", title: "Low Stock Alert", message: "Mechanical Keyboard (MK-002) is running low — 8 units left", type: "stock", read: false, createdAt: ago(15) },
  { id: "n3", title: "Payment Received", message: "৳12,500 payment received from রাকিব উদ্দিন", type: "payment", read: false, createdAt: ago(30) },
  { id: "n4", title: "Staff On Leave", message: "করিম মিয়া has requested leave for 3 days", type: "staff", read: true, createdAt: ago(60) },
  { id: "n5", title: "Out of Stock", message: "Laptop Sleeve 15\" (LS-013) is out of stock", type: "stock", read: true, createdAt: ago(120) },
  { id: "n6", title: "System Update", message: "System maintenance scheduled for tonight at 2:00 AM", type: "system", read: true, createdAt: ago(180) },
  { id: "n7", title: "New Return Request", message: "Return request #R-1005 submitted by ফারহানা ইসলাম", type: "order", read: false, createdAt: ago(45) },
  { id: "n8", title: "Coupon Expired", message: "Coupon SAVE500 has expired", type: "system", read: true, createdAt: ago(300) },
  // LMS Notifications
  { id: "lms1", title: "New Course Recommended! 🎯", message: "\"Node.js & Express Backend Mastery\" আপনার skills-এর সাথে 96% match করে", type: "lms-course", read: false, createdAt: ago(5) },
  { id: "lms2", title: "Badge Earned! 🏅", message: "আপনি \"Quick Learner\" badge অর্জন করেছেন — 3টি course 1 সপ্তাহে শেষ!", type: "lms-badge", read: false, createdAt: ago(10) },
  { id: "lms3", title: "7-Day Streak! 🔥", message: "অসাধারণ! আপনি টানা 7 দিন শিখেছেন — streak চালু রাখুন!", type: "lms-streak", read: false, createdAt: ago(25) },
  { id: "lms4", title: "Quiz Result: 92% 🎉", message: "\"JavaScript Fundamentals\" quiz-এ আপনি 92% পেয়েছেন — Excellent!", type: "lms-quiz", read: true, createdAt: ago(90) },
  { id: "lms5", title: "Certificate Ready! 🎓", message: "\"Web Development Bootcamp\" সার্টিফিকেট ডাউনলোডের জন্য প্রস্তুত", type: "lms-certificate", read: true, createdAt: ago(150) },
];

type Listener = () => void;
const listeners = new Set<Listener>();
let notifications = [...initialNotifications];

export function getNotifications() { return notifications; }

export function addNotification(title: string, message: string, type: NotificationType) {
  const n: Notification = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications = [n, ...notifications];
  listeners.forEach(fn => fn());
  return n;
}

export function markAsRead(id: string) {
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  listeners.forEach(fn => fn());
}

export function markAllAsRead() {
  notifications = notifications.map(n => ({ ...n, read: true }));
  listeners.forEach(fn => fn());
}

export function deleteNotification(id: string) {
  notifications = notifications.filter(n => n.id !== id);
  listeners.forEach(fn => fn());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
