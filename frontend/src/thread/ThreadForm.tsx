import { FC,FormEvent,useState } from 'react';
import { Thread } from '../types/thread';

const ThreadForm: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newThread: Omit<Thread, 'id'> = { title , content };

    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newThread),
      });

      if (!response.ok) {
        throw new Error('スレッドの作成に失敗しました');
      }

      setSuccess('スレッドが正常に作成されました');
      setTitle('');
      setContent('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>新しいスレッドを作成</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            タイトル:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            本文:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? '送信中...' : '送信'}
          </button>
        </div>
      </form>
      {error && <div style={{ color: 'red' }}>エラー: {error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
};

export default ThreadForm;