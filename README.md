# ☕ Cozy Café
A cute, cozy drag-and-drop drink-building game built with vanilla HTML, CSS, and JavaScript. Mix lattes, teas, matcha drinks, and more. With realistic color blending, layered physics, and fun topping animations.

Link to Game: <strong><a href="https://codepen.io/fatima-d09/full/QwKygZN" target="_blank:>Click Here</a></strong>
<hr>
<h2>🎮 How to Play</h2>
<ol>
  <li>Drag ingredients from the left panel into the cup</li>
  <li>Watch your ingredients layer inside the cup in real time</li>
  <li>After 2 seconds, the liquid ingredients blend together into a realistic mixed color</li>
  <li>Hit <strong>Serve</strong> to score a point — match a recipe for a bonus!</li>
  <li>Hit <strong>Clear</strong> to start fresh</li>
</ol>
<hr>
<h2>🧪 Layering Physics</h2>
<p>Ingredients follow real-world drink rules:</p>
<table>
  <thead><tr><th>Layer</th><th>Position</th><th>Ingredients</th></tr></thead>
  <tbody>
    <tr><td>Boba</td><td>Bottom</td><td>Sinks due to weight</td></tr>
    <tr><td>Liquid</td><td>Middle</td><td>Base + milk + syrups blend together</td></tr>
    <tr><td>Foam</td><td>Above liquid</td><td>Always floats to the top</td></tr>
    <tr><td>Toppings</td><td>Surface</td><td>Sit on foam (or liquid if no foam)</td></tr>
  </tbody>
</table>
<hr>
<h2>🎨 Color Mixing</h2>
<p>Colors are blended using <strong>OKLab</strong>, a perceptually uniform color space that mirrors how the human eye perceives color — not just raw RGB averaging.</p>
<p>Volume weights determine how much each ingredient influences the final color:</p>
<ul>
  <li><strong>Base</strong> (espresso, matcha, tea) — concentrated, strong hue</li>
  <li><strong>Syrup</strong> (caramel, lavender, etc.) — dense, pigmented, tints clearly</li>
  <li><strong>Milk</strong> (milk, oat milk, cream) — lightens gently, preserves hue</li>
</ul>
<p>Examples:</p>
<ul>
  <li>Espresso + Milk → warm latte brown</li>
  <li>Matcha + Oat Milk → muted sage green</li>
  <li>Hibiscus + Milk → dusty rose</li>
  <li>Chocolate + Espresso → deep dark brown</li>
  <li>Lavender + Milk → soft lilac</li>
</ul>
<hr>
<h2>🎀 Toppings</h2>
<table>
  <thead><tr><th>Topping</th><th>Visual</th></tr></thead>
  <tbody>
    <tr><td>☁️ Foam</td><td>Bubbly white layer that floats above liquid</td></tr>
    <tr><td>🟤 Cinnamon</td><td>Scattered brown dust dots</td></tr>
    <tr><td>🌹 Rose Petals</td><td>35 pink ellipses at random angles</td></tr>
    <tr><td>🎊 Sprinkles</td><td>Colorful confetti rectangles</td></tr>
    <tr><td>⚫ Boba</td><td>Black pearl circles at the bottom</td></tr>
  </tbody>
</table>
<p><strong>Shaker animation:</strong> Dropping cinnamon, rose petals, or sprinkles triggers a tilted shaker that appears above the cup and shakes for 3 seconds.</p>
<hr>
<h2>📖 Recipes (15 total)</h2>
<table>
  <thead><tr><th>Drink</th><th>Ingredients</th></tr></thead>
  <tbody>
    <tr><td>Classic Latte</td><td>Espresso, Milk, Foam</td></tr>
    <tr><td>Matcha Latte</td><td>Matcha, Oat Milk, Foam</td></tr>
    <tr><td>Chai Latte</td><td>Chai, Milk, Cinnamon</td></tr>
    <tr><td>Lavender Latte</td><td>Espresso, Milk, Lavender, Foam</td></tr>
    <tr><td>Caramel Macchiato</td><td>Espresso, Milk, Caramel, Foam</td></tr>
    <tr><td>Strawberry Matcha</td><td>Matcha, Oat Milk, Strawberry</td></tr>
    <tr><td>Honey Green Tea</td><td>Green Tea, Honey, Milk</td></tr>
    <tr><td>Hibiscus Tea</td><td>Hibiscus, Honey, Rose Petals</td></tr>
    <tr><td>Boba Milk Tea</td><td>Black Tea, Milk, Boba</td></tr>
    <tr><td>Vanilla Cold Brew</td><td>Cold Brew, Cream, Vanilla</td></tr>
    <tr><td>Coconut Matcha</td><td>Matcha, Coconut, Honey</td></tr>
    <tr><td>Chai Boba</td><td>Chai, Oat Milk, Boba, Cinnamon</td></tr>
    <tr><td>Brown Sugar Latte</td><td>Espresso, Milk, Brown Sugar, Foam</td></tr>
    <tr><td>Mocha</td><td>Espresso, Milk, Chocolate, Foam</td></tr>
    <tr><td>White Mocha</td><td>Espresso, Milk, White Choc, Foam</td></tr>
  </tbody>
</table>
<hr>
<h2>📱 Responsive Design</h2>
<ul>
  <li><strong>Desktop</strong> — three-column layout (ingredients / cup / recipes)</li>
  <li><strong>Tablet</strong> — panels shrink fluidly with clamp()</li>
  <li><strong>Mobile</strong> — stacks vertically; ingredients and recipes scroll independently</li>
  <li><strong>Touch support</strong> — full touch drag-and-drop polyfill for mobile devices</li>
</ul>
<hr>
<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>HTML5</strong> — single file, no build step</li>
  <li><strong>CSS3</strong> — responsive layout with clamp(), media breakpoints, keyframe animations</li>
  <li><strong>SVG</strong> — cup rendering with clipPath for clean liquid containment</li>
  <li><strong>Vanilla JavaScript</strong> — all game logic, color math, drag-and-drop</li>
  <li><strong>OKLab color space</strong> — perceptually accurate color blending</li>
  <li><strong>Touch polyfill</strong> — custom touch event handler for mobile drag support</li>
</ul>
<hr>
<h2>🚀 Getting Started</h2>
<p>No dependencies, no build tools needed.</p>
<pre><code>open index.html</code></pre>
<p>Or drop the HTML file into any static hosting service (GitHub Pages, Netlify, Vercel, etc.).</p>
<hr>
<h2>💡 Possible Future Features</h2>
<ul>
  <li>👤 Customer order system with requests and ratings</li>
  <li>⏱️ Timed café rush mode</li>
  <li>🔊 Sound effects (pouring, shaking, serving)</li>
  <li>🌡️ Hot vs iced drink toggle</li>
  <li>🏆 Leaderboard / high score tracking</li>
  <li>🧋 More drink types (smoothies, lemonade, hot chocolate)</li>
</ul>
