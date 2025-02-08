/* global AR */

if (location.protocol != "https:") {
  location.href =
    "https:" + window.location.href.substring(window.location.protocol.length);
}

async function startARSession() {
  if (!AR.isSupported()) {
    throw new Error(
      "This device is not compatible with this AR experience.\n\n" +
        "User agent: " +
        navigator.userAgent
    );
  }

  const tracker = AR.Tracker.Image();
  await tracker.database.add([
    {
      name: "my-reference-image",
      image: document.getElementById("my-reference-image"),
    },
  ]);

  const viewport = AR.Viewport({
    container: document.getElementById("ar-viewport"),
    hudContainer: document.getElementById("ar-hud"),
  });

  //const video = document.getElementById('my-video');
  //const source = AR.Source.Video(video);
  const source = AR.Source.Camera();

  const session = await AR.startSession({
    mode: "immersive",
    viewport: viewport,
    trackers: [tracker],
    sources: [source],
    stats: true,
    gizmos: true,
  });

  const scan = document.getElementById("scan");

  tracker.addEventListener("targetfound", (event) => {
    if (scan) scan.hidden = true;

    console.log("Target found: " + event.referenceImage.name);
  });

  tracker.addEventListener("targetlost", (event) => {
    if (scan) scan.hidden = false;

    console.log("Target lost: " + event.referenceImage.name);
  });

  return session;
}


startARSession();
