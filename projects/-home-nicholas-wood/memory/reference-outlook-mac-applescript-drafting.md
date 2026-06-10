---
name: reference-outlook-mac-applescript-drafting
description: "Pipeline for staging draft emails in Outlook on Nick's Mac from this Linux PAI box: SSH via the `mac` host alias, osascript over stdin, Outlook `content:` requires HTML markup (paragraphs/bullets do not survive as plain-text newlines)."
metadata: 
  node_type: memory
  type: reference
  originSessionId: be69e8a5-58c5-40f8-8c1d-1f3e30084237
---

# Drafting into Outlook on Mac via SSH + AppleScript

When Nick says "draft an email in Outlook" or equivalent, this pipeline works from this Linux PAI box.

## Connection

- Mac is reachable over Tailscale at `100.121.235.21` (`nicholass-macbook-pro.tail87fbca.ts.net`).
- SSH alias `mac` is configured in `~/.ssh/config` (HostName `nicholass-macbook-pro`). Public-key auth, no password.
- First SSH-driven Outlook control attempt hangs because macOS pops a TCC permission dialog ("ssh wants permission to control Microsoft Outlook"). User must click OK on the Mac once. After that, SSH-driven AppleScript runs in a few seconds.

## The pipeline

1. Write an `.applescript` file locally under `$CLAUDE_JOB_DIR` (do not put it in the working tree — it is run-once scaffolding).
2. Pipe it to `osascript -` over SSH: `ssh -o BatchMode=yes mac "osascript -" < /path/to/script.applescript`.
3. Expect `draft created: <subject>` and exit 0 on success.
4. A new Outlook compose window opens on Nick's Mac with the draft staged. The draft is also in the Drafts folder.

## Outlook-specific quirks

- **`content:` is HTML** in Outlook for Mac. Plain-text newlines (`\n` from AppleScript string concatenation) are stripped by the HTML parser, so the body renders as a single blob. Solution: format the body with `<p>...</p>` for paragraphs and `<ul><li>...</li></ul>` for bullet lists. Do NOT mix typographic `•` characters with HTML markup — let `<ul>` render the bullets.
- **`plain text content:`** is the alternative if a fully-plain-text draft is wanted, but using it may switch the message away from Outlook's rich-text mode and lose Nick's signature/formatting defaults. Default to HTML.
- **Reading the Drafts folder** via AppleScript fails with `-1723 Access not allowed` even when *creating* drafts works. Don't use draft-folder reads to verify; trust the `make new outgoing message` return value plus visual confirmation from Nick.
- **`make new outgoing message` does not send.** It creates a draft. `open theMessage` opens the compose window. There is no implicit send. This matches Nick's standing rule: drafting is free, sending requires single-action approval per send.

## Canonical AppleScript template

```applescript
on run
	set theSubject to "<SUBJECT>"
	set theBody to "<p>Paragraph 1</p>" & ¬
		"<p>Paragraph 2</p>" & ¬
		"<ul>" & ¬
		"<li>Bullet 1</li>" & ¬
		"<li>Bullet 2</li>" & ¬
		"</ul>" & ¬
		"<p>Closing paragraph</p>" & ¬
		"<p>Cheers,<br>Nick</p>"

	tell application id "com.microsoft.Outlook"
		set theMessage to make new outgoing message with properties {subject:theSubject, content:theBody}
		open theMessage
	end tell

	return "draft created (HTML body): " & theSubject
end run
```

## Recipient handling

- Leave `To:` blank by default. Recipient email addresses guessed from a colleague's name are too easy to get wrong; let Nick address from his Outlook contacts.
- If recipients are confirmed in conversation, add them with `make new recipient at theMessage with properties {email address:{address:"..."}}` calls, one per addressee, after the `make new outgoing message` call.

## Cleanup if a bad draft was created

- Multiple drafts with the same subject can accumulate during iteration. Reads on the Drafts folder are restricted, so PAI can't sweep them. Tell Nick which one is current and ask him to delete the others manually from Drafts.

Linked: [[feedback-outbound-explicit-approval]] (sending always needs a per-action approval, drafting does not).
