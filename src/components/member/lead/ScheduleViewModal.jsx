import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Users, Loader2 } from 'lucide-react';
import { leadCreateSchema } from '@/lib/validations/lead.validation';
import leadService from '@/api/services/lead.service';
import { toast } from 'sonner';

/**
 * ScheduleViewModal Component
 * UC23: Modal để Member đặt lịch xem hoặc yêu cầu môi giới
 * 
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onOpenChange - Handle open change
 * @param {Object} props.post - Post object (có postId, title, etc.)
 * @param {Function} props.onSuccess - Callback khi tạo Lead thành công
 */
export default function ScheduleViewModal({ open, onOpenChange, post, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(leadCreateSchema),
    defaultValues: {
      postId: post?.postId || '',
      leadType: 'SCHEDULE_VIEW',
    },
  });

  // Update postId when post changes
  useEffect(() => {
    if (post?.postId) {
      form.setValue('postId', post.postId);
    }
  }, [post, form]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const response = await leadService.createLead(data);
      
      if (response.success) {
        toast.success(
          data.leadType === 'SCHEDULE_VIEW' 
            ? 'Đặt lịch xem thành công! Staff sẽ liên hệ với bạn sớm nhất.'
            : 'Yêu cầu môi giới thành công! Staff sẽ liên hệ với bạn sớm nhất.'
        );
        form.reset();
        onOpenChange(false);
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo Lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error(
        error.response?.data?.message || 
        'Có lỗi xảy ra khi tạo Lead. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {form.watch('leadType') === 'SCHEDULE_VIEW' 
              ? 'Đặt lịch xem sản phẩm' 
              : 'Yêu cầu môi giới'}
          </DialogTitle>
          <DialogDescription>
            {form.watch('leadType') === 'SCHEDULE_VIEW'
              ? 'Bạn muốn đặt lịch xem sản phẩm này. Staff sẽ liên hệ với bạn để sắp xếp lịch hẹn.'
              : 'Bạn muốn yêu cầu môi giới cho sản phẩm này. Staff sẽ hỗ trợ bạn trong quá trình mua bán.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">{post.title}</h4>
          {post.price && (
            <p className="text-sm text-muted-foreground">
              Giá: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(post.price)}
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="leadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại yêu cầu</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại yêu cầu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SCHEDULE_VIEW">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Đặt lịch xem</span>
                        </div>
                      </SelectItem>
                      {/* Có thể thêm AUCTION_WINNER nếu cần */}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === 'SCHEDULE_VIEW'
                      ? 'Đặt lịch để xem trực tiếp sản phẩm'
                      : 'Yêu cầu Staff hỗ trợ môi giới'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.watch('leadType') === 'SCHEDULE_VIEW'
                  ? 'Đặt lịch xem'
                  : 'Gửi yêu cầu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

