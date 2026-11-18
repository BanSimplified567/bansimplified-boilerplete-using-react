
// src/pages/Contact.tsx
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    setLoading(false);

    if (error) {
      setError('Failed to submit your message. Please try again.');
      console.error(error);
    } else {
      setSuccess('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Email</h2>
          <p>
            <a href="mailto:support@example.com" className="text-indigo-400 underline">
              bansimplified567@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Phone</h2>
          <p>
            +63 (961) 983-9317
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Address</h2>
          <p>
            Poblacion , Pandan Sibonga Cebu , 6020
          </p>
        </section>

        <form onSubmit={ handleSubmit } className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={ name }
            onChange={ (e) => setName(e.target.value) }
            required
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
            required
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <textarea
            placeholder="Your Message"
            value={ message }
            onChange={ (e) => setMessage(e.target.value) }
            required
            rows={ 5 }
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <button
            type="submit"
            disabled={ loading }
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded font-semibold"
          >
            { loading ? 'Sending...' : 'Send Message' }
          </button>

          { success && <p className="text-green-400 mt-2">{ success }</p> }
          { error && <p className="text-red-400 mt-2">{ error }</p> }
        </form>

        <p className="mt-8 text-sm text-gray-300">
          We will respond within 1-2 business days.
        </p>
      </div>
    </div>
  );
}

