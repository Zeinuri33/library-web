import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    ChevronDown,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Pilcrow,
    Quote,
    Redo2,
    UnderlineIcon,
    Undo2,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export function RichTextToolbar({
    editor,
    onImageClick,
    onLinkClick,
}: {
    editor: any
    onImageClick: () => void
    onLinkClick: () => void
}) {
    if (!editor) {
return null
}

    const getTextAlign = () =>
        editor.state.selection.$from.parent.attrs.textAlign || null

    const buttonClass = (active: boolean) =>
        `
        flex h-9 min-w-[32px] items-center justify-center
        rounded-md transition
        ${
            active
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
        }
    `

    const headingOptions = [
        { label: "Paragraf", action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
        { label: "Judul 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
        { label: "Judul 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    ]

    const activeHeadingLabel =
        headingOptions.find((option) => option.active)?.label ?? "Paragraf"

    return (
        <div className="flex flex-wrap justify-center gap-1">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive("bold"))}
            >
                <Bold className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive("italic"))}
            >
                <Italic className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={buttonClass(editor.isActive("underline"))}
            >
                <UnderlineIcon className="h-4 w-4" />
            </button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className={`${buttonClass(false)} gap-1 px-1.5`}
                    >
                        <span className="text-sm font-medium">
                            {activeHeadingLabel}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-40">
                    {headingOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.label}
                            onSelect={() => option.action()}
                            className="focus:bg-muted focus:text-foreground"
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive("bulletList"))}
            >
                <List className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive("orderedList"))}
            >
                <ListOrdered className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={buttonClass(editor.isActive("blockquote"))}
            >
                <Quote className="h-4 w-4" />
            </button>

            <Separator orientation="vertical" className="h-8" />

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={buttonClass(getTextAlign() === "left")}
            >
                <AlignLeft className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={buttonClass(getTextAlign() === "center")}
            >
                <AlignCenter className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={buttonClass(getTextAlign() === "right")}
            >
                <AlignRight className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={buttonClass(getTextAlign() === "justify")}
            >
                <AlignJustify className="h-4 w-4" />
            </button>

            <Separator orientation="vertical" className="h-8" />

            <button
                type="button"
                onClick={onImageClick}
                className={buttonClass(false)}
            >
                <ImagePlus className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => onLinkClick()}
                className={buttonClass(false)}
            >
                <Link2 className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={buttonClass(false)}
            >
                <Pilcrow className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className={buttonClass(false)}
            >
                <Undo2 className="h-4 w-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className={buttonClass(false)}
            >
                <Redo2 className="h-4 w-4" />
            </button>
        </div>
    )
}
