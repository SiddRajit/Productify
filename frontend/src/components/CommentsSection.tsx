import { useState } from "react";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { useCreateComment, useDeleteComment } from "../hooks/useComments";
import {
  SendIcon,
  Trash2Icon,
  MessageSquareIcon,
  LogInIcon,
  Loader2,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Badge } from "#/components/ui/badge";
import type { Comment } from "../types/comments";

type CommentsSectionProps = {
  productId: string;
  comments: Comment[] | undefined;
  currentUserId: string | null | undefined;
};

function CommentsSection({
  productId,
  comments = [],
  currentUserId,
}: CommentsSectionProps) {
  const { isSignedIn } = useAuth();
  const [content, setContent] = useState("");
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment(productId);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate(
      { productId, content },
      { onSuccess: () => setContent("") },
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-5 text-primary" />
        <h3 className="font-bold">Comments</h3>
        <Badge variant="secondary" className="text-xs">
          {comments.length}
        </Badge>
      </div>

      {/* Input or sign in prompt */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createComment.isPending}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={createComment.isPending || !content.trim()}
          >
            {createComment.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendIcon className="size-4" />
            )}
          </Button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
          <span className="text-sm text-muted-foreground">
            Sign in to join the conversation
          </span>
          <SignInButton mode="modal">
            <Button size="sm" className="gap-1">
              <LogInIcon className="size-4" />
              Sign In
            </Button>
          </SignInButton>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquareIcon className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <img
                src={comment.user?.imageUrl}
                alt={comment.user?.name}
                className="size-8 rounded-full shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {comment.user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  {comment.content}
                </div>
              </div>
              {currentUserId === comment.userId && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="shrink-0"
                  disabled={deleteComment.isPending}
                  onClick={() =>
                    deleteComment.mutate({ commentId: comment.id })
                  }
                >
                  {deleteComment.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-3" />
                  )}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
