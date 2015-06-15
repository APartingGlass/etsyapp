"use strict";
require("es5-shim")
require("babel/register")

export var homeview = (array) =>`
<div class="grid grid-2-400 grid-4-800">
${array.map((obj) => `<a href="#details/${obj.listing_id}">
    <img src="${obj.Images[0].url_570xN}">
    <h5>${obj.title}</h5> 
    </a>`).join(' ')
}
    <div>
    `

export var detailedView = (obj) => `
	<div>${obj.title}
	<div>${obj.Images.map((obj) => `<img src=${obj.url_570xN}></img>`).join(' ')}</div>
	${obj.description}
	</div>`