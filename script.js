/*
	Copyright (c) 2011 Theis Mackeprang (http://www.5p.dk/)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/*
	Cannot override:
	CTRL-W - Close window
	CTRL-T - New tab
	CTRL-N - New window
	Everything else seems to be overrideable!
*/

/* TODO:
	- separate console into protocol and message,
		where message can be used for typing aswell
*/

// Key bindings:
// Must be ordered: SHIFT, then CTRL, then ALT, then CHARACTER
var shortcuts = {
	'CTRL-Q': {'h': 'Toggle Emacs-mode', 'f': function(e) { log("Hmm.. How did you get here?") } },
	'CTRL-G': {'h': 'Cancel', 'f': function(e) { log("Hmm.. How did you get here?") } },
	'CTRL-S': {'h': 'I-search links', 'f': function(e) { searchLinks(e, 0) } },
	'CTRL-ALT-S': {'h': 'Regexp I-search links', 'f': function(e) { searchLinks(e, 1) } },
	'CTRL-R': {'h': 'Reverse I-search links', 'f': function(e) { searchLinks(e, 0) } },
	'CTRL-ALT-R': {'h': 'Reverse regexp I-search links', 'f': function(e) { searchLinks(e, 1) } },
	'CTRL-J': {'h': 'Jump to link or form control', 'f': function(e) { jumpTo(e) } },
	// native functions
	'BACKSPACE': {'h': 'Previous page in history', 'f': function(e) { log("Hmm.. How did you get here?") } },
	'CTRL-T': {'h': 'New tab', 'f': function(e) { chrome.extension.sendRequest({'action':'NEW_TAB'}) } },
	'ESC': {'h': 'Remove focus from link or form control', 'f': function(e) { log("Hmm.. How did you get here?") } },
	'CTRL-X': {
		'CTRL-C': {'h': 'Close all windows', 'f': function(e) { chrome.extension.sendRequest({'action':'CLOSE_ALL_WINDOWS'}) } },
		'K': { 'h': 'Close current tab', 'f': function(e) { chrome.extension.sendRequest({'action':'CLOSE_TAB'}) } },
		'5': {
			'0': { 'h': 'Close current window', 'f': function(e) { chrome.extension.sendRequest({'action':'CLOSE_WINDOW'}, function(r){}) } },
			'2': {'h': 'New window', 'f': function(e) { chrome.extension.sendRequest({'action':'NEW_WINDOW'}, function(r){}) } }
		}
	},
	/* Scrolling in X */
	// small scrolling
	'N': {'h': 'Scroll down 10%', 'f': function(e) { scroll(10, 0) } },
	'CTRL-N': {'f': function(e) { scroll(10, 0) } },
	'P': {'h': 'Scroll up 10%', 'f': function(e) { scroll(-10, 0) } },
	'CTRL-P': {'f': function(e) { scroll(-10, 0) } },
	'J': {'h': 'Scroll down 10%', 'f': function(e) { scroll(10, 0) } },
	'K': {'h': 'Scroll up 10%', 'f': function(e) { scroll(-10, 0) } },
	// medium scrolling
	'ALT-E': {'h': 'Scroll down 50%', 'f': function(e) { scroll(50, 0) } },
	'ALT-A': {'h': 'Scroll up 50%', 'f': function(e) { scroll(-50, 0) } },
	// page scrolling
	'V': {'h': 'Scroll down 90%', 'f': function(e) { scroll(90, 0) } },
	'CTRL-V': {'f': function(e) { scroll(90, 0) } },
	'ALT-V': {'h': 'Scroll up 90%', 'f': function(e) { scroll(-90, 0) } },
	// home and end on > and SHIFT->
	'>': {'h': 'Scroll to end', 'f': function(e) { document.body.scrollTop = document.body.offsetHeight } },
	'SHIFT->': {'h': 'Scroll to home', 'f': function(e) { document.body.scrollTop = 0 } },
	'ALT->': {'f': function(e) { document.body.scrollTop = document.body.offsetHeight } },
	'SHIFT-ALT->': {'f': function(e) { document.body.scrollTop = 0 } },
	/* Scrolling in Y */
	// small scrolling
	'F': {'h': 'Scroll right 10%', 'f': function(e) { scroll(10, 1) } },
//	'CTRL-F': function(e) { scroll(10, 1) } },
	'B': {'h': 'Scroll left 10%', 'f': function(e) { scroll(-10, 1) } },
	'CTRL-B': {'f': function(e) { scroll(-10, 1) } },
	// large scrolling
	'ALT-F': {'h': 'Scroll right 50%', 'f': function(e) { scroll(50, 1) } },
	'ALT-B': {'h': 'Scroll left 50%', 'f': function(e) { scroll(-50, 1) } },
	// page scrolling
	'E': {'h': 'Scroll right 90%', 'f': function(e) { scroll(90, 1) } },
	'CTRL-E': {'f': function(e) { scroll(90, 1) } },
	'A': {'h': 'Scroll left 90%', 'f': function(e) { scroll(-90, 1) } },
	'CTRL-A': {'f': function(e) { scroll(-90, 1) } },
	// help function
	'SHIFT-+': {'h': 'Show help', 'f': function(e) { showHelp() } },
	'CTRL-H': {'M': {'h': 'Show help', 'f': function(e) { showHelp() } } },
	// eval javascript
	'SHIFT-ALT-1': {'h': 'Evaluate JavaScript', 'f': function(e) { evalJS(e) } },
	// link to the god damn GPL
	'CTRL-6': {'h': 'Show license for EMACS icon', 'f': function(e) { log("The EMACS icon is distributed under the <a href='http://www.gnu.org/licenses/gpl-3.0.html'>GPv3 license</a>.") } }
};
var inSeq = [];
var enabled = 1;
var readInput = 0;
var readPress = 0;
var readQuit = 0;

// add emacs status/input bar and dummy fill-element, to make page longer
var term = 0;
var termfill = 0;
// define log-func
var log = function(msg) {
	if (!document.body) return;
	if (!term) {
		termfill = document.createElement('DIV');
		termfill.className = 'styleReset emacsFill';
		document.body.appendChild(termfill);
		term = document.createElement('DIV');
		term.className = "styleReset emacsConsole";
		document.body.appendChild(term);
	}
	while (term.firstChild) term.removeChild(term.firstChild);
	term.style.display = 'block';
	var m = document.createElement("SPAN");
	m.innerHTML = msg;
	term.appendChild(m);
}

var resetConsole = function(keeplog) {
	if (!keeplog) {
		if (termfill) document.body.removeChild(termfill);
		if (term) document.body.removeChild(term);
		termfill = 0;
		term = 0;
	}
	readInput = 0;
	readPress = 0;
	readQuit = 0;
	inSeq = [];
}
resetConsole();



document.addEventListener("keyup", function(e) {
	if (enabled) {
		e.preventDefault();
		e.stopPropagation();
	}
});
document.addEventListener("keypress", function(e) {
	if (enabled) {
		e.stopPropagation();
		if (readPress instanceof Function) {
			e.preventDefault();
			readPress(e, String.fromCharCode(e.keyCode).toUpperCase());
		}
	}
}, false);

// listen on keyboard events
var keydownevent = function(e) {
	if (e.stopPropagation) e.stopPropagation();
	
	// read input
	var input = '';
	if (e.shiftKey) input += 'SHIFT-';
	if (e.ctrlKey)  input += 'CTRL-';
	if (e.altKey)   input += 'ALT-';
	var key;
	switch (e.keyCode) {
		case 226:
		case 188:
		case 190: key = '>'; break;
		case 187:
		case 191: key = '+'; break;
		default: key = String.fromCharCode(e.keyCode).toUpperCase(); break;
	}
	input += key;
	//console.log("Input: "+input+" ("+e.keyCode+")");
	
	if (enabled) {
		// cancel? esc if no elm has focus
		if ((e.target == document.body && e.keyCode == 27) || input == "CTRL-G") {
			if (e.preventDefault) e.preventDefault();
			if (readQuit instanceof Function) readQuit();
			resetConsole();
			if (input == "CTRL-G") return;
		}
		// Do nothing when using form controls
		if (e.target != document.body) {
			if (e.keyCode == 27) {
				// escape pressed, remove focus
				e.target.blur();
				return;
			}
		}
		// did a function request the input?
		if (readInput instanceof Function) {
			if (!(readPress instanceof Function) && e.preventDefault) e.preventDefault();
			readInput(e, input, key);
			return;
		}
		if (e.target != document.body) {
			switch (e.target.tagName) {
				case "INPUT":
				case "TEXTAREA":
				case "SELECT":
				// case "BUTTON":
				return;
			}
		}
	}
	
	// native keybindings
	if (!inSeq.length) {
		if (input == 'CTRL-Q') {
			enabled = !enabled;
			if (enabled) {
				chrome.extension.sendRequest({'action':'ENABLE'});
				log("Emacs-mode enabled!");
			} else {
				if (e.preventDefault) e.preventDefault();
				chrome.extension.sendRequest({'action':'DISABLE'});
				if (readQuit instanceof Function) readQuit();
				resetConsole();
			}
			return;
		}
		if (!enabled) return;
		// backspace: page back
		if (e.keyCode == 8) {
			if (e.preventDefault) e.preventDefault();
			history.go(-1);
			return;
		}
		// if no shortcut exist in first press,
		// do default action
		if (!shortcuts[input]) return;
	}
	
	// is the plugin disabled? then do nothing
	if (!enabled) return;
	
	// stop events
	if (e.preventDefault) e.preventDefault();
	
	// find shortcut
	var shortcut = shortcuts;
	inSeq.push(input);
	log(inSeq.join(" "));
	for (var i = 0; i < inSeq.length; ++i) if (shortcut[inSeq[i]]) {
		shortcut = shortcut[inSeq[i]];
		if (shortcut['f']) {
			// sequence match
			resetConsole();
			shortcut['f'](e);
		}
	} else {
		// invalid sequence
		log(inSeq.join(" ")+" is undefined");
		resetConsole(1);
	}
}
document.addEventListener("keydown", keydownevent, false);
chrome.extension.onRequest.addListener(function(req, sender, r) {
	switch (req.action) {
	case "keydown":
		keydownevent(req.event);
		break;
	case "showHelp":
		showHelp();
		break;
	}
});

/* Jump to - label-scheme */
var jumpTo = function(e) {
	// allocate data struct
	log("Jump to label: ");
	var data = {'elms': [], 'labels': []};

	// eventlistener:
	var _gs = function(e) { return document.defaultView.getComputedStyle(e); }
	var _gi = function(i) { try { return i.parseInt() } catch (e) { return 0 }; }
	// lets bind those items
	data.elms = [];
	var types = ['A','INPUT','TEXTAREA','SELECT','BUTTON'];
	for (var i = 0; i < types.length; i++) {
		var elms = document.getElementsByTagName(types[i]);
		for (var j = 0; j < elms.length; j++) if ((elms[j].type || elms[j].childNodes.length) && elms[j].type != 'hidden' && _gs(elms[j]).display != 'none' && _gs(elms[j]).visibility != 'hidden')  data.elms.push(elms[j]);
	}
	if (data.elms.length < 1) return;

	// assign each element a label
	var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','O','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
	data.seqlen = Math.ceil(Math.log(data.elms.length)/Math.log(letters.length));
	var key = [];
	for (var i = 0; i < data.seqlen; ++i) key.push(0);
	for (var i = 0; i < data.elms.length; i++) {
		// assign letter
		var e = data.elms[i];
		var gs = _gs(e);
		e.dataset.aakext = ""
		for (var j = data.seqlen-1; j >= 0; --j) e.dataset.aakext += letters[key[j]]+(j > 0 ? "-" : "");
		key[0]++;
		var index = 0;
		while (key[index] >= letters.length) {
			key[index] = 0;
			key[++index]++;
		}

		// display the shortcuts
		var d = document.createElement('SPAN');
		var p = e.parentNode;
		d.innerText = e.dataset.aakext;
		d.className = 'styleReset aakextlabel';
		
		if (e.tagName == "A" || e.tagName == "BUTTON") {
			// yay, we can put the label inside the element
			var dd = document.createElement('SPAN');
			dd.className = 'styleReset aakextparent';
			dd.appendChild(d);
			if (e.childNodes.length) e.insertBefore(dd, e.childNodes[0]);
			else e.appendChild(dd);
			data.labels.push(dd);
		} else if (gs.position == "absolute" || gs.position == "fixed") {
			// fix this since we cannot inject into inputs, i.e. searchfield on wiki, lets put the label on same coordinates
			if (gs.left != "auto") d.style.left = _gi(gs.marginLeft)+_gi(gs.left)+"px";
			else if (gs.right != "auto") d.style.right = _gi(gs.marginRight)+_gi(gs.right)+"px";
			else d.style.marginLeft = _gi(gs.marginLeft)+"px";
			if (gs.top != "auto") d.style.top = _gi(gs.marginTop)+_gi(gs.top)+"px";
			else if (gs.bottom != "auto") d.style.bottom = Math.max(0,_gi(gs.marginBottom)+_gi(gs.bottom)+e.offsetHeight-10)+"px";
			else d.style.marginTop = _gi(gs.marginTop)+"px";
			if (_gi(gs.zIndex) >= 1100) d.style.zIndex = _gi(gs.zIndex)+1;
			p.appendChild(d);
			data.labels.push(d);
		} else if (gs.display == "block") {
			// these are block elements.. crap
			p = e.offsetParent || e.parentNode || document.body;
			var l = e.offsetLeft+_gi(gs.marginLeft);
			var t = e.offsetTop+_gi(gs.offsetTop);
			while (p.tagName == "TABLE" || p.tagName == "TH" || p.tagName == "TD") {
				l += p.offsetLeft;
				t += p.offsetTop;
				p = p.offsetParent || p.parentNode || document.body;
			}
			d.style.left = l+"px";
			d.style.top = t+"px";
			p.appendChild(d);
			data.labels.push(d);
		} else {
			var dd = document.createElement('SPAN');
			dd.className = 'styleReset aakextparent';
			dd.appendChild(d);
			p.insertBefore(dd, e);
			data.labels.push(dd);
		}
	}
	data.seq = [];
	readQuit = function() {
		// delete all injected labels
		for (var i = 0; i < data.elms.length; i++) if (data.elms[i]) delete data.elms[i].dataset.aakext;
		while (data.labels.length) {
			var e = data.labels.pop();
			e.parentNode.removeChild(e);
		}
		resetConsole(1);
	}
	readInput = function (e) {
		// links are activated, lets continue
		if (e.keyCode == 8) {
			if (data.seq.length) data.seq.pop();
			log("Jump to label: "+data.seq.join("-"));
			return;
		}
		if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)) {
			data.seq.push(String.fromCharCode(e.keyCode).toUpperCase());
			log("Jump to label: "+data.seq.join("-"));
			if (data.seq.length < data.seqlen) return;
			var seq = data.seq.join("-");
			for (var i = 0; i < data.elms.length; i++) if (data.elms[i] && data.elms[i].dataset.aakext == seq) {
				// found label
				data.elms[i].focus();
				readQuit();
				resetConsole();
				return;
			}
			// label not found
			readQuit();
			log("Label "+data.seq.join("-")+" is undefined");
			return;
		}
		return;
	}
}

var searchLinks = function(e, reg) {
	document.body.classList.add("emacsHighlightLinks");
	var links = document.getElementsByTagName("A");
	var sstr = "";
	var marked = 0;
	var name = reg ? "Regexp I-search: " : "I-search: ";
	log(name+sstr+" ("+links.length+" matches)");
	readQuit = function() {
		document.body.classList.remove("emacsHighlightLinks");
		if (links.length > marked) links[marked].classList.remove("emacsHighlightLinksSelected");
		for (var i = 0; i < links.length; i++) links[i].classList.remove("emacsHighlightLinks");
		resetConsole();
	}
	readInput = function(e, input, key) {
		if (e.keyCode == 8) { // backspace was pressed
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			if (sstr.length) {
				sstr = sstr.substring(0, sstr.length-1);
				if (links.length > marked) links[marked].classList.remove("emacsHighlightLinksSelected");
				links = document.getElementsByTagName("A");
				marked = links.length ? marked % links.length : 0;
			}
			return readPress(e, 0);
		}
		if (e.keyCode == 13) { // enter was pressed
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			if (links.length > marked) links[marked].focus();
			return readQuit();
		}
		if (input == "CTRL-S" || input == "CTRL-ALT-S") {
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			if (links.length > marked) {
				links[marked].classList.remove("emacsHighlightLinksSelected");
				marked = (marked+1) % links.length;
				links[marked].classList.add("emacsHighlightLinksSelected");
			}
		}
		if (input == "CTRL-R" || input == "CTRL-ALT-R") {
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			if (links.length > marked) {
				links[marked].classList.remove("emacsHighlightLinksSelected");
				marked = (marked-1) % links.length;
				if (marked < 0) marked += links.length;
				links[marked].classList.add("emacsHighlightLinksSelected");
			}
		}
	}
	readPress = function(e, key) {
		document.body.classList.remove("emacsHighlightLinks");
		if (links.length > marked) links[marked].classList.remove("emacsHighlightLinksSelected");
		if (key) sstr += String.fromCharCode(e.keyCode);
		var nlinks = [];
		if (reg) {
			try {
				var pat = new RegExp(sstr, "i");
				for (var i = 0; i < links.length; i++) if (pat.test(links[i].innerText)) {
					links[i].classList.add("emacsHighlightLinks");
					nlinks.push(links[i]);
				} else links[i].classList.remove("emacsHighlightLinks");
			} catch (e) {
				log(name+sstr+" (Error: "+e.message+")");
				return;
			}
		} else {
			var csstr = sstr.toUpperCase();
			for (var i = 0; i < links.length; i++) if (links[i].innerText.toUpperCase().indexOf(csstr) > -1) {
				links[i].classList.add("emacsHighlightLinks");
				nlinks.push(links[i]);
			} else links[i].classList.remove("emacsHighlightLinks");
		}
		links = nlinks;
		marked = links.length ? marked % links.length : 0;
		if (links.length > marked) links[marked].classList.add("emacsHighlightLinksSelected");
		log(name+sstr+" ("+links.length+" matches)");
	}
}


/* Page scrolling functions */
var scroll = function(p, d) {
	if (d) document.body.scrollLeft = document.body.scrollLeft+(p/100)*document.body.parentNode.clientWidth;
	else   document.body.scrollTop  = document.body.scrollTop +(p/100)*document.body.parentNode.clientHeight;
}

var readHelp = function(s, pre) {
	var h = "";
	for (var i in s) if (s[i]['f']) {
		if (s[i]['h']) h += pre+i+"\t"+s[i]['h']+"\n";
	} else h += readHelp(s[i], pre+i+" ");
	return h;
}

var helpOn = false;
var showHelp = function() {
	if (document.body) {
		if (helpOn) {
			// quit self
			helpOn = false;
			if (readQuit instanceof Function) readQuit();
			return;
		}
		if (readQuit instanceof Function) readQuit(); // quit other process?
		resetConsole();
		helpOn = true;
		var helpdiv = document.createElement('DIV');
		helpdiv.className = 'styleReset emacsHelp';
		helpdiv.innerHTML = "<h1>Emacs-mode for Google Chrome</h1>";
		var tablediv = document.createElement('DIV');
		tablediv.className = 'tableholder';
		tablediv.innerHTML = "<table cellspacing='5' align='center'><tr><td valign='top' nowrap='nowrap'>"+readHelp(shortcuts, "").replace(/\t/g, "</td><td valign='top'>: ").replace(/\n/g, "</td></tr><tr><td valign='top' nowrap='nowrap'>")+"</td></tr></table>";
		helpdiv.appendChild(tablediv);
		document.body.appendChild(helpdiv);
		readQuit = function() {
			helpOn = false;
			if (helpdiv) document.body.removeChild(helpdiv);
			resetConsole();
		}
		readInput = function() {
			readQuit();
		}
	}
}

var evalJS = function(e) {
	log("Eval JavaScript: ");
	var input = [];
	readQuit = function() {
		resetConsole(1);
	}
	readInput = function(e) {
		switch (e.keyCode) {
		case 8: // backspace
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			if (input.length) {
				input.pop();
				log("Eval JavaScript: "+input.join(""));
			}
			break;
		case 13: // enter
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			try {
				log(eval(input.join("")));
				readQuit();
			} catch(e) {
				log("Eval JavaScript: "+input.join("")+" (Error: "+e.message+")");
			}
			break;
		}
	}
	readPress = function(e) {
		input.push(String.fromCharCode(e.keyCode));
		log("Eval JavaScript: "+input.join(""));
	}
}
