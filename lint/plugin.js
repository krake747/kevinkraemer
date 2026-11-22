import { definePlugin } from "vite-plus/lint/plugins"

import { aliasImports } from "./rules/alias-imports.js"
import { componentPropsOmit } from "./rules/component-props-omit.js"
import { cvaClassProp } from "./rules/cva-class-prop.js"
import { featureNames } from "./rules/feature-names.js"
import { noClassStringConst } from "./rules/no-class-string-const.js"
import { noDescribeFunctionTitle } from "./rules/no-describe-function-title.js"
import { noProseComments } from "./rules/no-prose-comments.js"
import { noStylesImport } from "./rules/no-styles-import.js"
import { strictTypes } from "./rules/strict-types.js"

export default definePlugin({
    meta: { name: "kk" },
    rules: {
        "alias-imports": aliasImports,
        "component-props-omit": componentPropsOmit,
        "cva-class-prop": cvaClassProp,
        "feature-names": featureNames,
        "no-class-string-const": noClassStringConst,
        "no-describe-function-title": noDescribeFunctionTitle,
        "no-prose-comments": noProseComments,
        "no-styles-import": noStylesImport,
        "strict-types": strictTypes,
    },
})
