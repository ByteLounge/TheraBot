
"use client";

import type { FormEvent } from "react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "./ChatMessage";
import { interactWithAIChatbot, type AIChatbotInput, type AIChatbotOutput } from "@/ai/flows/ai-chatbot";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SendHorizonal, BotIcon, Smile, Leaf } from "lucide-react";
import { doc, addDoc, collection, serverTimestamp, Timestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "../shared/Spinner";

interface ChatSession {
  id?: string;
  userId: string;
  createdAt: Timestamp;
  messages: Message[];
}

// Type for Firestore message payload, imageUrl is optional
interface FirestoreMessagePayload {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Timestamp | Date | number | { seconds: number; nanoseconds: number; };
  imageUrl?: string; 
}


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();

  const botWelcomeMessage: Message = {
    id: "welcome-" + Date.now(),
    role: "bot",
    content: `Hello ${userProfile?.displayName || 'there'}! I'm TheraBot, your friendly AI companion. How are you feeling today? You can talk to me about anything on your mind.`,
    timestamp: new Date(),
    imageUrl: "https://placehold.co/40x40/D0C6E0/4A00E0.png?text=TB"
  };

  useEffect(() => {
    setMessages([botWelcomeMessage]);
  }, [userProfile?.displayName]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const saveMessageToFirestore = async (sessionId: string, messageToSave: Message) => {
    if (!currentUser) return;
    const sessionRef = doc(db, `users/${currentUser.uid}/chatSessions/${sessionId}`);
    
    const firestoreMessagePayload: FirestoreMessagePayload = {
      id: messageToSave.id,
      role: messageToSave.role,
      content: messageToSave.content,
      timestamp: messageToSave.timestamp instanceof Date 
                   ? Timestamp.fromDate(messageToSave.timestamp as Date) 
                   : messageToSave.timestamp,
    };

    // Only include imageUrl if it's for the bot and it's defined
    if (messageToSave.role === 'bot' && messageToSave.imageUrl !== undefined) {
      firestoreMessagePayload.imageUrl = messageToSave.imageUrl;
    }

    try {
      await updateDoc(sessionRef, {
        messages: arrayUnion(firestoreMessagePayload)
      });
    } catch (error) {
      console.error("Error saving message to Firestore:", error);
      toast({ title: "Error", description: "Could not save message to session.", variant: "destructive"});
    }
  };
  
  const createNewSession = async (): Promise<string> => {
    if (!currentUser) throw new Error("User not authenticated");
    const sessionData: Omit<ChatSession, 'id'> = {
        userId: currentUser.uid,
        createdAt: serverTimestamp() as Timestamp,
        messages: [] 
    };
    const sessionRef = await addDoc(collection(db, `users/${currentUser.uid}/chatSessions`), sessionData);
    return sessionRef.id;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentUser) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
      // imageUrl is intentionally omitted for user messages
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let sessionId = currentSessionId;
    if (!sessionId) {
        try {
            sessionId = await createNewSession();
            setCurrentSessionId(sessionId);
            if (messages.length > 0 && messages[0].id.startsWith("welcome-")) {
                 await saveMessageToFirestore(sessionId, messages[0]); 
            }
        } catch(error) {
            console.error("Failed to create session:", error);
            toast({ title: "Error", description: "Could not start a new chat session.", variant: "destructive"});
            setIsLoading(false);
            setMessages((prev) => prev.filter(m => m.id !== userMessage.id)); 
            setInput(userMessage.content); 
            return;
        }
    }
    await saveMessageToFirestore(sessionId, userMessage);

    try {
      const chatHistoryForAI = messages.map(m => ({ role: m.role, content: m.content })); 
      if (!chatHistoryForAI.find(m => m.content === userMessage.content && m.role === 'user')) {
          chatHistoryForAI.push({role: 'user', content: userMessage.content });
      }

      const aiInput: AIChatbotInput = { userInput: userMessage.content, chatHistory: chatHistoryForAI };
      const aiResponse: AIChatbotOutput = await interactWithAIChatbot(aiInput);

      const botMessage: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        content: aiResponse.response,
        timestamp: new Date(),
        imageUrl: "https://placehold.co/40x40/D0C6E0/4A00E0.png?text=TB"
      };
      setMessages((prev) => [...prev, botMessage]);
      await saveMessageToFirestore(sessionId, botMessage);

    } catch (error) {
      console.error("AI Chatbot error:", error);
      const errorMessage: Message = {
        id: "error-" + Date.now(),
        role: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        imageUrl: "https://placehold.co/40x40/D0C6E0/4A00E0.png?text=TB"
      };
      setMessages((prev) => [...prev, errorMessage]);
      if (sessionId) { 
        await saveMessageToFirestore(sessionId, errorMessage);
      }
      toast({
        title: "Chatbot Error",
        description: "Could not get a response from the AI. Please check your connection or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickResponses = [
    { text: "I'm feeling a bit down.", icon: Smile },
    { text: "Tell me something positive.", icon: Leaf },
    { text: "I need some advice.", icon: BotIcon },
  ];

  const handleQuickResponse = (text: string) => {
    setInput(text);
  };

  return (
    <Card className="flex h-[calc(100vh-10rem)] flex-col shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <BotIcon className="h-6 w-6 text-primary" />
            TheraBot AI Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} userName={userProfile?.displayName} />
          ))}
          {isLoading && (
            <div className="flex justify-start items-end gap-2 mb-4">
                <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src="https://placehold.co/40x40/D0C6E0/4A00E0.png?text=TB" alt="Bot" data-ai-hint="friendly robot" />
                    <AvatarFallback><BotIcon size={18} /></AvatarFallback>
                </Avatar>
                <div className="bg-card text-card-foreground rounded-xl px-4 py-3 shadow-md rounded-bl-none border">
                    <Spinner className="h-5 w-5 text-primary" />
                </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
       <CardFooter className="border-t p-4 space-y-2">
        <div className="flex gap-2 mb-2">
            {quickResponses.map(qr => (
                <Button key={qr.text} variant="outline" size="sm" onClick={() => handleQuickResponse(qr.text)} className="text-xs">
                    <qr.icon className="mr-1.5 h-3.5 w-3.5" />
                    {qr.text}
                </Button>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
            aria-label="Chat message input"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" aria-label="Send message">
            {isLoading ? <Spinner className="h-4 w-4" /> : <SendHorizonal className="h-5 w-5" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
