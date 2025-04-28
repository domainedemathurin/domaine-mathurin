import React, { useState, useRef } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Send, Trash2, Image, Smile } from 'lucide-react';
import ReactQuill from 'react-quill';
import EmojiPicker from 'emoji-picker-react';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

export function Newsletter() {
  const { subscribers, removeSubscriber } = useAdminStore();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSendNewsletter = () => {
    if (!subject.trim()) {
      alert('Veuillez ajouter un sujet à votre newsletter');
      return;
    }
    if (!content.trim()) {
      alert('Veuillez ajouter du contenu à votre newsletter');
      return;
    }
    
    // Simulation d'envoi de newsletter
    alert(`Newsletter "${subject}" envoyée à ${subscribers.length} abonnés !`);
    setSubject('');
    setContent('');
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = `<img src="${e.target?.result}" alt="Newsletter image" style="max-width: 100%; height: auto;" />`;
          setContent(prev => prev + img);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Newsletter</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${
              previewMode 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-olive-600 text-white hover:bg-olive-700'
            }`}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Éditer' : 'Aperçu'}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sujet
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet de la newsletter"
          />
        </div>

        <div className="relative" ref={editorRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu
          </label>
          
          {previewMode ? (
            <div 
              className="prose max-w-none border rounded-md p-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-64 mb-12"
              />
              
              <div className="absolute bottom-2 left-2 flex space-x-2">
                <button
                  onClick={handleImageUpload}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Ajouter une image"
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Ajouter un emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-10">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setContent(prev => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <button
          className="mt-4 bg-olive-600 text-white px-4 py-2 rounded-md hover:bg-olive-700 flex items-center"
          onClick={handleSendNewsletter}
        >
          <Send className="h-5 w-5 mr-2" />
          Envoyer
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Liste des abonnés ({subscribers.length})
        </h3>
        <div className="overflow-y-auto max-h-64">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => removeSubscriber(subscriber.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}