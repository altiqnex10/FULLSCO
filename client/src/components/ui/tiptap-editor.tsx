import { useState } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  ListOrdered,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Undo,
  Redo,
} from 'lucide-react';

type TiptapEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false,
  children 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean;
  children: React.ReactNode; 
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded ${
      isActive 
        ? 'bg-neutral-200 text-primary' 
        : 'text-neutral-700 hover:bg-neutral-200'
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-2 text-neutral-300">|</span>;

export function TiptapEditor({ content, onChange, placeholder = 'ابدأ بكتابة المحتوى الخاص بك هنا...' }: TiptapEditorProps) {
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    } else {
      const url = window.prompt('أدخل رابط الصورة');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const addLink = () => {
    const url = window.prompt('أدخل الرابط');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="tiptap-editor">
      <div className="tiptap-menu">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        >
          <Underline size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        >
          <Strikethrough size={16} />
        </MenuButton>
        
        <Divider />
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered size={16} />
        </MenuButton>
        
        <Divider />
        
        <MenuButton onClick={addLink}>
          <LinkIcon size={16} />
        </MenuButton>
        <MenuButton onClick={addImage}>
          <ImageIcon size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
        >
          <Code size={16} />
        </MenuButton>
        
        <Divider />
        
        <MenuButton 
          onClick={() => editor.chain().focus().undo().run()} 
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().redo().run()} 
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </MenuButton>
      </div>
      
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
}
