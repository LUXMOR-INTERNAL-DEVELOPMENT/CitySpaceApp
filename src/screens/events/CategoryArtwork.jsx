const palettes = {
  music: ["#93b4ff", "#4769d8", "#172c72", "#ffcf62"],
  nightlife: ["#ffe78b", "#f8ad36", "#a7443b", "#543364"],
  comedy: ["#ffd278", "#f08a5d", "#c94768", "#5e426f"],
  sports: ["#a5e4ca", "#4eaa8c", "#286d68", "#ffb15c"],
  theatre: ["#f7a6a2", "#ce5062", "#713d67", "#ffd481"],
  performances: ["#ffd48a", "#ed8a55", "#b94b4c", "#fff0b1"],
  navratri: ["#ffba76", "#e86d4f", "#993c4b", "#ffdc70"],
  fairs: ["#ffbd83", "#ee7658", "#9b4f75", "#ffdf81"],
  food: ["#f8d899", "#e4a851", "#ab653f", "#fff0be"],
  mixers: ["#ffb897", "#eb765f", "#a3475c", "#ffdf9b"],
  screenings: ["#a8e0ec", "#5daebf", "#3d657c", "#ffe087"],
  fitness: ["#c7a9ef", "#8a64bd", "#543c85", "#f2cd75"],
  conferences: ["#b7e3dc", "#6aada7", "#47747a", "#f3d38c"],
  openMics: ["#bca6f2", "#7964c7", "#473b83", "#ffc763"],
};

const artwork = {
  music: (
    <>
      <ellipse cx="80" cy="137" rx="49" ry="9" fill="#32487c" opacity=".14" />
      <path d="M42 92a38 38 0 0 1 76 0" fill="none" stroke="var(--art-main)" strokeWidth="13" strokeLinecap="round" />
      <rect x="34" y="82" width="24" height="42" rx="10" fill="var(--art-main)" />
      <rect x="102" y="82" width="24" height="42" rx="10" fill="var(--art-main)" />
      <circle cx="46" cy="100" r="6" fill="#dce7ff" opacity=".9" />
      <circle cx="114" cy="100" r="6" fill="#dce7ff" opacity=".9" />
      <path d="M126 111c10 0 12 8 7 14-3 4-8 5-14 4" fill="none" stroke="#172c72" strokeWidth="4" strokeLinecap="round" />
      <circle cx="112" cy="128" r="4" fill="#ffcf62" />
    </>
  ),
  nightlife: (
    <>
      <ellipse cx="80" cy="137" rx="53" ry="8" fill="#824351" opacity=".14" />
      <circle cx="112" cy="48" r="20" fill="#ffe78b" />
      <circle cx="120" cy="42" r="20" fill="#fff8db" />
      <path d="M29 116V83l17-12 17 12v33zm34 0V59l19-15 19 15v57zm38 0V77l16-10 16 10v39z" fill="var(--art-main)" />
      <path d="M51 87h5v7h-5zm0 15h5v7h-5zm42-37h5v7h-5zm0 15h5v7h-5zm0 15h5v7h-5zm25-8h5v7h-5zm0 15h5v7h-5z" fill="#fff0ad" opacity=".9" />
      <path d="m37 55 3-7 3 7 7 3-7 3-3 7-3-7-7-3zm87 4 2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#fff3bf" />
    </>
  ),
  comedy: (
    <>
      <ellipse cx="80" cy="137" rx="50" ry="8" fill="#77495c" opacity=".14" />
      <path d="M36 51c17-10 38-2 42 17 4 20-8 49-24 54-17 5-28-23-27-43 0-13 2-22 9-28z" fill="var(--art-main)" />
      <path d="M82 68c8-20 32-27 47-13 9 9 7 28 1 44-7 18-19 29-31 22-15-8-25-34-17-53z" fill="var(--art-secondary)" />
      <path d="M49 79q7-7 14 0M95 76q7-7 14 0" fill="none" stroke="#573c4c" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 96q10 12 21 0M93 100q10-14 20-1" fill="none" stroke="#873e50" strokeWidth="4" strokeLinecap="round" />
      <circle cx="47" cy="88" r="3" fill="#fff0b1" />
      <circle cx="116" cy="87" r="3" fill="#fff0b1" />
      <path d="m78 33 3-8 3 8 8 3-8 3-3 8-3-8-8-3z" fill="#ffdf86" />
    </>
  ),
  sports: (
    <>
      <ellipse cx="80" cy="137" rx="47" ry="8" fill="#376e64" opacity=".14" />
      <circle cx="81" cy="85" r="39" fill="var(--art-main)" />
      <path d="M48 69c20 8 38 26 43 52M104 56c-6 18-23 35-47 48M46 98c22-10 49-11 69-2" fill="none" stroke="#e7fff3" strokeWidth="3" opacity=".85" />
      <path d="M108 45c12 8 18 21 19 34l-13 4-22-23 4-13z" fill="var(--art-secondary)" />
      <path d="m91 47 17-12 6 8-13 14m-7-3 25-17m-18 26 25-17m-21 26 24-16" fill="none" stroke="#fff3d1" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m47 48 4-9 4 9 9 4-9 4-4 9-4-9-9-4z" fill="#ffb15c" />
    </>
  ),
  theatre: (
    <>
      <ellipse cx="80" cy="137" rx="48" ry="8" fill="#743b5f" opacity=".14" />
      <path d="M38 46h84v79H38z" fill="#fff0d1" />
      <path d="M38 46h26v79H38c10-15 12-30 0-41 11-11 11-24 0-38zm84 0H96v79h26c-10-15-12-30 0-41-11-11-11-24 0-38z" fill="var(--art-main)" />
      <path d="M64 125c2-24 8-40 16-52 8 12 14 28 16 52z" fill="var(--art-secondary)" />
      <path d="M72 125V91l8-13 8 13v34" fill="#f9d977" />
      <path d="M38 51h84M42 58h8m60 0h8" stroke="#fff1c7" strokeWidth="4" strokeLinecap="round" />
      <circle cx="80" cy="63" r="4" fill="#ffcf62" />
    </>
  ),
  performances: (
    <>
      <ellipse cx="80" cy="137" rx="50" ry="8" fill="#8b4c50" opacity=".14" />
      <path d="m80 50 7 48H73z" fill="#fff0b1" opacity=".7" />
      <path d="M47 104h66l-11 20H58z" fill="var(--art-main)" />
      <path d="M57 104c-10-14-9-28 0-38 10 8 13 20 12 38m8 0c-3-21 2-39 13-47 9 14 8 31 1 47m5 0c2-14 10-25 20-30 3 13-1 23-8 30" fill="var(--art-secondary)" />
      <path d="M52 105h62" stroke="#fff0b1" strokeWidth="3" strokeLinecap="round" />
      <path d="m48 52 3-7 3 7 7 3-7 3-3 7-3-7-7-3zm67 8 2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#fff1bf" />
    </>
  ),
  navratri: (
    <>
      <ellipse cx="80" cy="137" rx="49" ry="8" fill="#87454b" opacity=".14" />
      <path d="M49 63c0-14 14-24 31-24s31 10 31 24v47c0 14-14 24-31 24s-31-10-31-24z" fill="var(--art-main)" />
      <path d="M49 69h62M49 82h62M49 95h62M49 108h62" stroke="#ffe2a0" strokeWidth="5" opacity=".95" />
      <path d="M59 47v78m42-78v78" stroke="#a53e4c" strokeWidth="3" opacity=".55" />
      <path d="M40 47c18 10 42 32 56 57m23-58C99 59 75 83 61 108" fill="none" stroke="#ffdc70" strokeWidth="5" strokeLinecap="round" />
      <circle cx="40" cy="47" r="5" fill="#fff0af" />
      <circle cx="119" cy="46" r="5" fill="#fff0af" />
      <path d="M77 29h6v12h-6z" fill="#ffdc70" />
    </>
  ),
  fairs: (
    <>
      <ellipse cx="80" cy="137" rx="50" ry="8" fill="#884b68" opacity=".14" />
      <circle cx="80" cy="73" r="38" fill="#fff2d0" stroke="var(--art-main)" strokeWidth="7" />
      <circle cx="80" cy="73" r="7" fill="#9b4f75" />
      <path d="M80 35v76M42 73h76M53 46l54 54m0-54L53 100" stroke="#e98362" strokeWidth="3" />
      <path d="M49 111h62l13 16H36z" fill="var(--art-secondary)" />
      <path d="M64 111 54 127m26-16v16m16-16 10 16" stroke="#fff0b1" strokeWidth="5" />
      <path d="M80 22v13m-6-7h12" stroke="#ffcf62" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  food: (
    <>
      <ellipse cx="80" cy="137" rx="53" ry="8" fill="#8c6241" opacity=".14" />
      <path d="M36 105h88c-3 18-19 28-44 28s-41-10-44-28z" fill="var(--art-main)" />
      <path d="M44 104c6-20 21-31 36-31s30 11 36 31z" fill="var(--art-secondary)" />
      <path d="M55 99c7-11 16-17 25-17s18 6 25 17" fill="none" stroke="#fff0be" strokeWidth="4" strokeLinecap="round" />
      <path d="M52 112h56" stroke="#fff4d4" strokeWidth="3" opacity=".8" />
      <path d="M67 59c-7-8 5-12 0-20m15 20c-7-8 5-12 0-20m15 20c-7-8 5-12 0-20" fill="none" stroke="#e4a851" strokeWidth="4" strokeLinecap="round" />
      <circle cx="80" cy="103" r="4" fill="#a85644" />
    </>
  ),
  mixers: (
    <>
      <ellipse cx="80" cy="137" rx="50" ry="8" fill="#874e60" opacity=".14" />
      <path d="M41 48h39L65 91v28H53V91z" fill="var(--art-main)" />
      <path d="M81 54h38l-14 37v28H93V91z" fill="var(--art-secondary)" />
      <path d="M45 65h30m13 5h28" stroke="#ffe8bd" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 119h14m25 0h15" stroke="#88475c" strokeWidth="4" strokeLinecap="round" />
      <path d="M58 119v9m41-9v9" stroke="#a3475c" strokeWidth="3" />
      <path d="M80 41v13m-6-7h12" stroke="#fff1c4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="38" r="4" fill="#ffdf9b" />
      <circle cx="119" cy="44" r="4" fill="#ffdf9b" />
    </>
  ),
  screenings: (
    <>
      <ellipse cx="80" cy="137" rx="51" ry="8" fill="#426b7a" opacity=".14" />
      <rect x="36" y="56" width="88" height="58" rx="8" fill="var(--art-main)" />
      <rect x="46" y="66" width="68" height="38" rx="4" fill="#e8fbff" />
      <circle cx="80" cy="85" r="15" fill="var(--art-secondary)" />
      <circle cx="80" cy="85" r="6" fill="#f8e8a9" />
      <path d="M45 121h70m-57-7-6 7m49-7 6 7" stroke="#466e7c" strokeWidth="5" strokeLinecap="round" />
      <path d="M39 46h16m-16 7h10m62-7h10m-10 7h10" stroke="#fff0b1" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  fitness: (
    <>
      <ellipse cx="80" cy="137" rx="51" ry="8" fill="#604b84" opacity=".14" />
      <path d="M43 82h74v15H43z" rx="7" fill="#7658aa" />
      <path d="M49 65h19c6 0 10 5 10 11v28c0 8-5 13-12 13H49c-7 0-12-5-12-13V76c0-6 5-11 12-11zm62 0H92c-6 0-10 5-10 11v28c0 8 5 13 12 13h17c7 0 12-5 12-13V76c0-6-5-11-12-11z" fill="var(--art-main)" />
      <path d="M53 73v36m54-36v36" stroke="#eadcff" strokeWidth="4" opacity=".8" />
      <path d="m80 47 3 7 8 2-8 3-3 8-3-8-8-3 8-2z" fill="#f2cd75" />
    </>
  ),
  conferences: (
    <>
      <ellipse cx="80" cy="137" rx="52" ry="8" fill="#4b7774" opacity=".14" />
      <path d="M37 99h86l-8 15H45z" fill="var(--art-main)" />
      <path d="M49 114v13m62-13v13" stroke="#47747a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="59" cy="60" r="11" fill="#f0c28a" />
      <circle cx="101" cy="60" r="11" fill="#e8a783" />
      <path d="M44 91c0-14 6-22 15-22s15 8 15 22m12 0c0-14 6-22 15-22s15 8 15 22" fill="var(--art-secondary)" />
      <rect x="72" y="77" width="16" height="22" rx="3" fill="#f8e9ba" />
      <path d="M76 82h8m-8 5h8" stroke="#6aada7" strokeWidth="2" />
      <circle cx="80" cy="46" r="4" fill="#f3d38c" />
    </>
  ),
  openMics: (
    <>
      <ellipse cx="80" cy="137" rx="47" ry="8" fill="#4b3d84" opacity=".14" />
      <path d="M80 80v43m0 0-16 9m16-9 16 9" fill="none" stroke="#473b83" strokeWidth="5" strokeLinecap="round" />
      <rect x="68" y="38" width="24" height="53" rx="12" fill="var(--art-main)" />
      <path d="M68 60h24m-24 8h24m-22 8h20" stroke="#f2eaff" strokeWidth="3" opacity=".9" />
      <path d="M58 51c-7 8-7 20 0 28m44-28c7 8 7 20 0 28" fill="none" stroke="#7964c7" strokeWidth="4" strokeLinecap="round" />
      <path d="M49 59c-12 13-12 30 0 43m62-43c12 13 12 30 0 43" fill="none" stroke="#bca6f2" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="31" r="5" fill="#ffc763" />
    </>
  ),
};

const CategoryArtwork = ({ kind, label }) => {
  const [light, mid, dark, accent] = palettes[kind];

  return (
    <svg
      className="event-category-artwork"
      viewBox="0 0 160 160"
      role="img"
      aria-label={`${label} illustration`}
      style={{
        "--art-main": `url(#${kind}-art-main)`,
        "--art-secondary": `url(#${kind}-art-secondary)`,
      }}
    >
      <defs>
        <linearGradient id={`${kind}-art-main`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${kind}-art-secondary`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
      </defs>
      {artwork[kind]}
    </svg>
  );
};

export default CategoryArtwork;