import Image from '@tiptap/extension-image'

const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: { default: null },
            height: { default: null },
            style: { default: null },
        }
    },
})

export default ResizableImage
