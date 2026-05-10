"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appConfig } from "@/lib/config";
import { useAppDispatch } from "@/lib/store";
import { setUnreadNotifications } from "@/lib/store/ui-slice";
import { formatDate } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export function LiveNotificationBell() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`${appConfig.publicApiBaseUrl}/api/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data) as {
        latest: NotificationItem[];
        unreadCount: number;
      };

      setItems(payload.latest);
      setUnreadCount(payload.unreadCount);
      dispatch(setUnreadNotifications(payload.unreadCount));
    };

    return () => eventSource.close();
  }, [dispatch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="relative rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--secondary)] px-1 text-[10px] text-white">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.length === 0 ? (
          <DropdownMenuItem disabled>No new notifications yet.</DropdownMenuItem>
        ) : (
          items.map((item) => (
            <DropdownMenuItem key={item.id} className="block space-y-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{item.message}</div>
              <div className="text-[10px] uppercase tracking-normal text-[var(--muted-foreground)]">
                {formatDate(item.createdAt)}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
