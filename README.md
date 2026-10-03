# HSC Flashcards: your own site with sign-in and sync

This puts the flashcards on a free GitHub Pages site, full screen on any device. Each person signs in with their own account, and their progress syncs live between their PC, iPhone and iPad. Friends create their own accounts with their own private progress.

You need a free **GitHub** account and a free **Firebase** project (a Google account). No payment method is needed: Firebase's free Spark plan includes email sign-in and the Firestore database this uses.

---

## 1. Create a Firebase project
1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Select **Create a project**, name it something like `hsc-flashcards`, and continue. You can turn Google Analytics off.
3. Leave it on the free **Spark** plan.

## 2. Register a web app and paste its settings
1. On the project overview, select **Add app**, then the **Web** icon (`</>`).
2. Nickname it `HSC Flashcards`. Don't tick Firebase Hosting. Select **Register app**.
3. Firebase shows a block starting `const firebaseConfig = {`. Copy that whole block.
4. Open `firebase-config.js` and replace the example block with yours. Keep the last line, `window.FIREBASE_CONFIG = firebaseConfig;`.

The values in this block aren't passwords. They're meant to sit in a public website; the database rules in step 4 are what keep each person's progress private.

## 3. Turn on email sign-in
1. In the left menu: **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Email/Password** → switch on the first toggle → **Save**.
3. **Settings** tab → **Authorized domains** → **Add domain** → enter `YOUR-GITHUB-USERNAME.github.io`.

## 4. Create the database and protect it
1. **Build → Firestore Database → Create database**.
2. If asked for an edition, choose **Standard**. For location, choose **australia-southeast1 (Sydney)**. Start in **production mode**.
3. Open the **Rules** tab, replace everything with the rules below, and select **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, delete: if request.auth != null && request.auth.uid == uid;
      allow create, update: if request.auth != null && request.auth.uid == uid
                            && request.resource.data.state is string
                            && request.resource.data.state.size() < 900000;
    }
  }
}
```

These rules mean each signed-in person can only read and write their own progress.

## 5. Put the site on GitHub
1. At <https://github.com>, select **New repository**. Name it `hsc-flashcards`, set it to **Public**, and create it.
2. Select **uploading an existing file**. Drag in every file from this folder: `index.html`, `modules.js`, the `cards-*.js` files, `firebase-config.js`, `manifest.webmanifest`, the three `icon-*.png` files and this `README.md`.
3. Select **Commit changes**.

## 6. Turn on GitHub Pages
1. In the repository: **Settings → Pages**.
2. Under **Build and deployment**: Source **Deploy from a branch**, Branch **main**, folder **/ (root)** → **Save**.
3. After a minute or two the site is live at `https://YOUR-GITHUB-USERNAME.github.io/hsc-flashcards/`. Refresh the Pages settings to see the link.

## 7. Move your existing progress across
1. Open the old version in Claude → sidebar → **Back up** → **Copy backup**.
2. Open your new site → **Create account**.
3. Sidebar → **Back up** → paste into **Restore from a backup** → **Restore progress** → confirm.

## 8. Use it on your iPad and iPhone
1. Open the site in Safari and sign in.
2. For a full-screen app: **Share → Add to Home Screen**. Apps added this way keep their own storage, so sign in once more inside the app.

---

## Friends
Send them the link. They select **Create account** and get their own progress. Nobody can see anyone else's.

## Free limits
The free plan allows 50,000 reads and 20,000 writes per day, plus 1 GiB of storage. A study session uses a few hundred at most, so a group of friends stays well within it.

## How the files fit together
- `index.html`: the app itself. Rarely changes.
- `modules.js`: the catalogue: built-in subjects, their modules, and which card files to load.
- `cards-*.js`: one file of built-in cards per module (e.g. `cards-chem-m6.js`).
- `firebase-config.js`: your Firebase settings. Never replace this one when updating.

## Adding a new module
1. Ask Claude to make the card file for it (e.g. `cards-chem-m8.js`), uploading the slides and your current `modules.js`.
2. In the repository, **Add file → Upload files**, add the new card file and **Commit**.
3. Open `modules.js` in the repository, select the pencil icon to edit, add the new file name to the `files` list, increase `version` by 1, then **Commit changes**.

Everyone sees the new module after a refresh. Raising `version` makes devices fetch the new files instead of an old saved copy.

## Your own subjects and decks
Each account can hide built-in subjects it doesn't take and add its own subjects, topics, decks and cards (sidebar → **Manage subjects**). You can also add your own decks inside built-in modules, e.g. a deck on your own essay in English Module A. These are saved to the account and sync across that person's devices; nobody else sees them. Cards can be added one at a time or imported from Quizlet or a spreadsheet: one card per line, front and back separated by a tab or `|`.

## Updating the app later
Upload the new files over the old ones (**Add file → Upload files**, then commit). Never replace your `firebase-config.js`. Progress and everyone's own decks live in their accounts, so updates never touch them.

## Troubleshooting
- **"Email sign-in isn't switched on"**: redo step 3.
- **"Sync is blocked by the database rules"**: check the rules in step 4 were published.
- **"The Firebase settings aren't right"**: re-copy the config block (step 2) and keep the last line.
- **Site still shows the old version**: GitHub Pages can take a few minutes to update; then refresh.
