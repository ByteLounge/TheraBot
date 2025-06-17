"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatMessage, type Message as MessageType } from "@/components/chat/ChatMessage";
import { format } from "date-fns";
import { ChevronRight, MessageSquareText, Hourglass, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ChatSessionSummary {
  id: string;
  createdAt: Date;
  firstMessageContent?: string;
  messageCount: number;
}

interface ChatSessionDetail extends ChatSessionSummary {
  messages: MessageType[];
}

export function ChatHistoryList() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const sessionsRef = collection(db, `users/${currentUser.uid}/chatSessions`);
        const q = query(sessionsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedSessions: ChatSessionSummary[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const messagesArray = data.messages || [];
          fetchedSessions.push({
            id: docSnap.id,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
            firstMessageContent: messagesArray.length > 0 ? messagesArray[0].content : "Chat started",
            messageCount: messagesArray.length,
          });
        });
        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
        toast({ title: "Error", description: "Could not load chat history.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [currentUser, toast]);

  const handleSelectSession = async (sessionId: string) => {
    if (!currentUser) return;
    setIsLoadingDetails(true);
    setSelectedSession(null); // Clear previous selection first
    try {
      const sessionRef = doc(db, `users/${currentUser.uid}/chatSessions`, sessionId);
      const docSnap = await getDoc(sessionRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const messages = (data.messages || []).map((msg: any) => ({
            ...msg,
            timestamp: (msg.timestamp as Timestamp)?.toDate() || new Date() // Convert Firestore Timestamp
        }));
        setSelectedSession({
          id: docSnap.id,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          firstMessageContent: messages.length > 0 ? messages[0].content : "Chat started",
          messageCount: messages.length,
          messages: messages,
        });
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      toast({ title: "Error", description: "Could not load session details.", variant: "destructive" });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    // Placeholder for delete functionality
    toast({ title: "Not Implemented", description: "Delete functionality is coming soon." });
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <Skeleton className="h-[calc(100vh-12rem)] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Past Conversations</CardTitle>
          <CardDescription>Select a session to view its details.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {sessions.length === 0 ? (
              <Alert>
                <Hourglass className="h-4 w-4" />
                <AlertTitle>No History Yet</AlertTitle>
                <AlertDescription>
                  Your past chat sessions will appear here once you start chatting with TheraBot.
                </AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-2">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <Button
                      variant={selectedSession?.id === session.id ? "secondary" : "ghost"}
                      className="w-full justify-between h-auto p-3 text-left items-start"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex-grow">
                        <p className="font-medium text-sm truncate">{session.firstMessageContent}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(session.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-xs text-muted-foreground">{session.messageCount} messages</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 flex flex-col">
        {isLoadingDetails ? (
            <div className="flex items-center justify-center h-full">
                <Hourglass className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : selectedSession ? (
          <>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="font-headline text-lg">
                    Chat on {format(new Date(selectedSession.createdAt), "MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>
                    {format(new Date(selectedSession.createdAt), "h:mm a")} - {selectedSession.messageCount} messages
                    </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this chat session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSession(selectedSession.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <ScrollArea className="h-full p-4">
                {selectedSession.messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} userName={currentUser?.displayName || "You"} />
                ))}
              </ScrollArea>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageSquareText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="font-semibold text-lg">Select a session</p>
            <p className="text-muted-foreground">
              Choose a conversation from the list to see the messages.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
