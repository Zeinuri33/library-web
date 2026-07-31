import Image from "@tiptap/extension-image"

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),

            alt: {
                default: null,
            },

            title: {
                default: null,
            },

            align: {
                default: "center",
                parseHTML: (element) => {
                    const cls = element.className || ""

                    if (cls.includes("mr-auto")) {
return "left"
}

                    if (cls.includes("ml-auto")) {
return "right"
}

                    return "center"
                },
                renderHTML: (attributes) => {
                    return {
                        class:
                            attributes.align === "left"
                                ? "mr-auto"
                                : attributes.align === "right"
                                  ? "ml-auto"
                                  : "mx-auto",
                    }
                },
            },

            size: {
                default: "large",

                parseHTML: (element) => {
                    const cls = element.className || ""

                    if (cls.includes("w-1/4")) {
return "small"
}

                    if (cls.includes("w-1/2")) {
return "medium"
}

                    if (cls.includes("w-3/4")) {
return "large"
}

                    if (cls.includes("w-full")) {
return "full"
}

                    return "large"
                },

                renderHTML: (attributes) => {
                    let sizeClass = ""

                    switch (attributes.size) {
                        case "small":
                            sizeClass = "w-1/4"
                            break

                        case "medium":
                            sizeClass = "w-1/2"
                            break

                        case "large":
                            sizeClass = "w-3/4"
                            break

                        case "full":
                            sizeClass = "w-full"
                            break

                        default:
                            sizeClass = "w-3/4"
                    }

                    return {
                        class: sizeClass,
                    }
                },
            },
        }
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "img",
            {
                ...HTMLAttributes,
                class: `
                    my-4
                    block
                    ${HTMLAttributes.class || ""}
                `,
            },
        ]
    },
})
