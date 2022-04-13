import { HoverPopover, Plugin } from "obsidian";
import tippy from "tippy.js";
import { openOrSwitch } from "obsidian-community-lib";

export default class HoverLinkPlugin extends Plugin {
  internalLinkClick = async (
    evt: MouseEvent,
    validClassName: string
  ): Promise<boolean> => {
    const { button, altKey, ctrlKey, metaKey, shiftKey } = evt;
    let el = evt.target as Element;
    console.log(el, " = el");
    let modifier = "none";
    if (altKey) {
      modifier = "alt";
    } else if (ctrlKey) {
      modifier = "ctrl";
    } else if (metaKey) {
      modifier = "meta";
    } else if (shiftKey) {
      modifier = "shift";
    }
    if (modifier !== "meta") {
      return;
    }
    if (
      ["cm-underline", "nav-file-title-content", "nav-file-title"].some((s) =>
        el.classList.contains(s)
      )
    ) {
      const url = el.getAttribute("href");
      const text = el.getText();

      if (modifier === "meta") {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        console.log("ahahah", text);

        openOrSwitch(this.app, `${text}.md`, evt);
        return true;
      }
    } else if (
      // [
      //   "search-result-file-title",
      //   "tree-item-inner",
      //   "search-result-file-matches",
      //   "search-result-file-match",
      //   "search-result-file-matched-text",
      // ].some((s) => el.classList.contains(s))
      true
    ) {
      let found = el.classList.contains("tree-item-inner") ? el : null;
      let count = 0
      while (!found && count <= 10) {
        found = el.querySelector(".tree-item-inner");
        el = el.parentElement;
        count ++
      }
      if (found) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        const a = found.innerHTML;
        openOrSwitch(this.app, `${a}.md`, evt);
        return true;
      }
    }
  };
  _evt: any;
  onunload(): void {
    document.removeEventListener("click", this._evt, { capture: true });
  }
  async onload() {
    this._evt = (evt: MouseEvent) => {
      return this.internalLinkClick(evt, "cm-underline");
    };
    document.addEventListener("click", this._evt, { capture: true });

    // document.addEventListener('click', (evt: MouseEvent) => {
    //   return internalLinkClick(evt, "cm-underline");
    //  } , { capture: true})

    // this.registerDomEvent(document, "click", (evt: MouseEvent) => {
    //   return internalLinkClick(evt, "cm-underline");
    // });

    // this.registerDomEvent(document, "auxclick", (evt: MouseEvent) => {
    //   return internalLinkClick(evt, "cm-underline");
    // });

    this.registerMarkdownPostProcessor((element) => {
      // We only want to add tooltips to:
      //  1. external links
      //  2. links which don't already show the href
      const targetLinks = Array.from(element.getElementsByTagName("a")).filter(
        (link) => link.classList.contains("internal-link")
      );
    });
  }
}

function App() {}
