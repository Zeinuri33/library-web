import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Undo, Redo, Code, Code2, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Link as LinkIcon, RemoveFormatting, Image as ImageIcon,
} from 'lucide-react'
import { NodeSelection } from 'prosemirror-state'
import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'
import ResizableImage from '@/extensions/resizable-image'

const ALIGN_MAP: Record<string, string> = {
    left: 'float:left;margin-right:1rem',
    center: 'display:block;margin:0 auto',
    right: 'float:right;margin-left:1rem',
}

export default function TiptapEditor({
    value,
    onChange,
    placeholder = 'Tulis konten...',
    onUpload,
}: {
    value: string
    onChange: (html: string) => void
    placeholder?: string
    onUpload?: (url: string) => void
}) {
    const [linkUrl, setLinkUrl] = useState('')
    const [linkOpen, setLinkOpen] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [, forceUpdate] = useState(0)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Highlight.configure({ multicolor: true }),
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
            ResizableImage.configure({
                inline: false,
                allowBase64: false,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        onSelectionUpdate: () => {
            forceUpdate((n) => n + 1)
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3',
            },
            handleClick: (view, pos, event) => {
                const target = event.target as HTMLElement

                if (target.tagName === 'IMG') {
                    const $pos = view.state.doc.resolve(pos)

                    if ($pos.nodeAfter?.type.name === 'image') {
                        view.dispatch(view.state.tr.setSelection(new NodeSelection($pos)))
                    }

                    return true
                }

                return false
            },
        },
    })

    if (!editor) {
return null
}

    const isImageSelected = useCallback(() => {
        const { selection } = editor.state

        return selection instanceof NodeSelection && selection.node.type.name === 'image'
    }, [editor])

    const getImageAttrs = useCallback(() => {
        const { selection } = editor.state

        if (selection instanceof NodeSelection && selection.node.type.name === 'image') {
            return selection.node.attrs
        }

        return {}
    }, [editor])

    const setLink = () => {
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
        }

        setLinkUrl('')
        setLinkOpen(false)
    }

    const openLinkPopover = () => {
        const previousUrl = editor.getAttributes('link').href
        setLinkUrl(previousUrl || '')
        setLinkOpen(true)
    }

    const setImageAlign = (align: string) => {
        if (!isImageSelected()) {
            editor.chain().focus().setTextAlign(align as any).run()

            return
        }

        const attrs = getImageAttrs()
        const currentStyle = attrs.style || ''

        const map: Record<string, string> = {
            left: 'float:left',
            center: 'margin:0 auto',
            right: 'float:right',
        }

        if (currentStyle.includes(map[align] || '')) {
            editor.chain().focus().updateAttributes('image', { style: null }).run()
        } else {
            editor.chain().focus().updateAttributes('image', { style: ALIGN_MAP[align] || '' }).run()
        }
    }

    const getAlignActive = (align: string) => {
        if (isImageSelected()) {
            const map: Record<string, string> = {
                left: 'float:left',
                center: 'margin:0 auto',
                right: 'float:right',
            }
            const style = getImageAttrs().style || ''

            return style.includes(map[align] || '')
        }

        return editor.isActive({ textAlign: align })
    }

    const uploadImage = async (file: File) => {
        setUploading(true)
        const form = new FormData()
        form.append('file', file)

        try {
            const res = await fetch('/admin/upload-image', {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
            })

            if (!res.ok) {
                const text = await res.text()

                throw new Error(text.slice(0, 200))
            }

            const data = await res.json()

            if (data.url) {
                onUpload?.(data.url)
                editor
                    .chain()
                    .focus()
                    .setImage({ src: data.url })
                    .run()
            }
        } catch (err: any) {
            alert('Gagal upload: ' + (err.message || 'unknown error'))
        }

        setUploading(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
uploadImage(file)
}

        e.target.value = ''
    }

    const groups = [
        [
            { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
            { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
            { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
            { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
            { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight') },
        ],
        [
            { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
            { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
            { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
        ],
        [
            { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
            { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
            { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
            { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
            { icon: Code2, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
        ],
        [
            { icon: AlignLeft, action: () => setImageAlign('left'), active: getAlignActive('left') },
            { icon: AlignCenter, action: () => setImageAlign('center'), active: getAlignActive('center') },
            { icon: AlignRight, action: () => setImageAlign('right'), active: getAlignActive('right') },
            { icon: AlignJustify, action: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) },
        ],
    ]

    return (
        <div className="border rounded-md overflow-hidden">
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50 items-center">
                {groups.map((group, gi) => (
                    <div key={gi} className="flex items-center gap-1">
                        {gi > 0 && <div className="w-px h-5 bg-border mx-1" />}
                        {group.map((tool, i) => (
                            <Toggle
                                key={i}
                                pressed={tool.active}
                                onPressedChange={tool.action}
                                size="sm"
                            >
                                <tool.icon className="h-4 w-4" />
                            </Toggle>
                        ))}
                    </div>
                ))}

                <div className="w-px h-5 bg-border mx-1" />

                <Popover open={linkOpen} onOpenChange={setLinkOpen}>
                    <PopoverTrigger asChild>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('link')}
                            onPressedChange={openLinkPopover}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-3">
                            <Label>URL Tautan</Label>
                            <Input
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        setLink()
                                    }
                                }}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={setLink}>
                                    {editor.getAttributes('link').href ? 'Update' : 'Tambah'}
                                </Button>
                                {editor.getAttributes('link').href && (
                                    <Button size="sm" variant="outline" onClick={() => {
                                        editor.chain().focus().unsetLink().run()
                                        setLinkOpen(false)
                                    }}>
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Toggle
                    size="sm"
                    pressed={false}
                    onPressedChange={() => fileRef.current?.click()}
                    disabled={uploading}
                >
                    <ImageIcon className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-5 bg-border mx-1" />

                <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                    <RemoveFormatting className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-5 bg-border mx-1" />

                <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().undo().run()}>
                    <Undo className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().redo().run()}>
                    <Redo className="h-4 w-4" />
                </Toggle>
            </div>

            <EditorContent editor={editor} className="bg-background" />
        </div>
    )
}
