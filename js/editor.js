/* Copyright (C) Sandeep Mogla
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Sandeep Mogla <sandeep.mogla@gmail.com>, October 2016
 */
var canvas;
var a;
var b;
var line1;
var line2;
var line3;
var line4;
var imgIns;
$(document).ready(function () {
        $('#data').hide();
        //setup front side canvas 
        canvas = new fabric.Canvas('tc', {
                hoverCursor: 'pointer',
                selection: true,
                selectionBorderColor: 'blue'
        });
        canvas.on({
                'object:moving': function (e) {
                        e.target.opacity = 0.5;

                        var obj = e.target;
                        // if object is too big ignore
                        if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
                                return;
                        }
                        obj.setCoords();
                        // top-left  corner
                        if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                                obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                                obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
                        }
                        // bot-right corner
                        if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
                                obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
                                obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
                        }
                },
                'object:modified': function (e) {
                        e.target.opacity = 1;
                },
                'object:selected': onObjectSelected,
                'selection:cleared': onSelectedCleared
        });
        // piggyback on `canvas.findTarget`, to fire "object:over" and "object:out" events
        canvas.findTarget = (function (originalFn) {
                return function () {
                        var target = originalFn.apply(this, arguments);
                        if (target) {
                                if (this._hoveredTarget !== target) {
                                        canvas.fire('object:over', {
                                                target: target
                                        });
                                        if (this._hoveredTarget) {
                                                canvas.fire('object:out', {
                                                        target: this._hoveredTarget
                                                });
                                        }
                                        this._hoveredTarget = target;
                                }
                        } else if (this._hoveredTarget) {
                                canvas.fire('object:out', {
                                        target: this._hoveredTarget
                                });
                                this._hoveredTarget = null;
                        }
                        return target;
                };
        })(canvas.findTarget);
        canvas.on('object:over', function (e) { //TO DO
        });
        canvas.on('object:out', function (e) { //TO DO
        });
        $('.language-control').change(function () { //TO DO
        });
        var textFooter;
        var textHeader;
        var textBody;
        $('.btn-checkbox').click(function (e) {
                console.log("$(this).hasClass('active') " + $(this).hasClass('active'));
                if (!$(this).hasClass('active')) {
                        if ($(this).attr('data-value') == 1) {
                                if (textHeader != undefined) {
                                        return;
                                }
                                textHeader = new fabric.Text("add header here", {
                                        left: 135,
                                        top: 30,
                                        fontFamily: 'helvetica',
                                        angle: 0,
                                        fill: '#000000',
                                        scaleX: 1,
                                        scaleY: 1,
                                        fontSize: 24,
                                        fontWeight: '',
                                        hasRotatingPoint: true
                                });
                                canvas.add(textHeader);
                                canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
                        } else if ($(this).attr('data-value') == 2) {
                                if (textBody != undefined) {
                                        return;
                                }
                                textBody = new fabric.Text("add some body text", {
                                        left: 135,
                                        top: 150,
                                        fontFamily: 'helvetica',
                                        angle: 0,
                                        fill: '#999999',
                                        scaleX: 1,
                                        scaleY: 1,
                                        fontWeight: '',
                                        fontSize: 24,
                                        hasRotatingPoint: true
                                });
                                canvas.add(textBody);
                                canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
                        } else if ($(this).attr('data-value') == 3) {
                                if (textFooter != undefined) {
                                        return;
                                }
                                textFooter = new fabric.Text("- at footer your name", {
                                        left: 290,
                                        top: 290,
                                        fontFamily: 'helvetica',
                                        angle: 0,
                                        fill: '#000000',
                                        scaleX: 1,
                                        scaleY: 1,
                                        fontWeight: '',
                                        fontStyle: 'italic',
                                        fontSize: 18,
                                        hasRotatingPoint: true
                                });
                                canvas.add(textFooter);
                                canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
                        }
                        $("#texteditor").css('display', 'none');
                } else {
                        if ($(this).attr('data-value') == 1) {
                                canvas.remove(textHeader);
                                textHeader = undefined;
                        } else if ($(this).attr('data-value') == 2) {
                                canvas.remove(textBody);
                                textBody = undefined;
                        } else if ($(this).attr('data-value') == 3) {
                                canvas.remove(textFooter);
                                textFooter = undefined;
                        }
                }
        });

        function keepPosFixed(obj) {
                obj.setCoords();
                // top-left  corner
                if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
                }
                // bot-right corner
                if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
                        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
                        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
                }
        }
        document.getElementById('add-text').onclick = function () {
                var text = $("#text-string").val();
                var textSample = new fabric.Text(text, {
                        left: fabric.util.getRandomInt(0, 100),
                        top: fabric.util.getRandomInt(0, 100),
                        fontFamily: 'helvetica',
                        angle: 0,
                        fill: '#000000',
                        scaleX: 0.5,
                        scaleY: 0.5,
                        fontWeight: '',
                        hasRotatingPoint: true
                });
                canvas.add(textSample);
                canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
                $("#texteditor").css('display', 'block');
        };
        $("#text-string").keyup(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.text = this.value;
                        canvas.renderAll();
                }
        });
        $("#sizesTypes").change(function (e) {
                debugger;
                if ($(this).val() == "1") {
                        line1 = new fabric.Line([0, 0, 420, 0], {
                                "stroke": "#EEEEEE",
                                "strokeWidth": 1,
                                hasBorders: false,
                                hasControls: false,
                                hasRotatingPoint: false,
                                selectable: false
                        });
                        line2 = new fabric.Line([479, 0, 480, 320], {
                                "stroke": "#EEEEEE",
                                "strokeWidth": 1,
                                hasBorders: false,
                                hasControls: false,
                                hasRotatingPoint: false,
                                selectable: false
                        });
                        line3 = new fabric.Line([0, 0, 0, 320], {
                                "stroke": "#EEEEEE",
                                "strokeWidth": 1,
                                hasBorders: false,
                                hasControls: false,
                                hasRotatingPoint: false,
                                selectable: false
                        });
                        line4 = new fabric.Line([0, 320, 480, 319], {
                                "stroke": "#EEEEEE",
                                "strokeWidth": 1,
                                hasBorders: false,
                                hasControls: false,
                                hasRotatingPoint: false,
                                selectable: false
                        });
                }
        });
        line1 = new fabric.Line([0, 0, 480, 0], {
                stroke: "#EEEEEE",
                strokeWidth: 1,
                hasBorders: false,
                hasControls: false,
                hasRotatingPoint: false,
                selectable: false
        });
        line2 = new fabric.Line([479, 0, 480, 320], {
                stroke: "#EEEEEE",
                strokeWidth: 1,
                hasBorders: false,
                hasControls: false,
                hasRotatingPoint: false,
                selectable: false
        });
        line3 = new fabric.Line([0, 0, 0, 320], {
                stroke: "#EEEEEE",
                strokeWidth: 1,
                hasBorders: false,
                hasControls: false,
                hasRotatingPoint: false,
                selectable: false
        });
        line4 = new fabric.Line([0, 320, 480, 319], {
                stroke: "#EEEEEE",
                strokeWidth: 1,
                hasBorders: false,
                hasControls: false,
                hasRotatingPoint: false,
                selectable: false
        });
        canvas.add(line1);
        canvas.add(line2);
        canvas.add(line3);
        canvas.add(line4);
        canvas.renderAll();
        $(".img-polaroid").click(function (e) {
                var el = e.target;
                var design = $(this).attr("src");
                var sw = canvas.width;
                var sh = canvas.height;
                canvas.setBackgroundImage(design, canvas.renderAll.bind(canvas), {
                        width: sw,
                        height: sh,
                        opacity: 0.5
                });
        });
        var clipart;
        $(".img-art").click(function (e) {
                var el = e.target;
                /*temp code*/
                var offset = 50;
                var left = canvas.width / 2;
                var top = canvas.height / 2;
                var width = fabric.util.getRandomInt(30, 50);

                fabric.Image.fromURL(el.src, function (image) {
                        if (clipart != null) {
                                canvas.remove(clipart);
                        }
                        image.set({
                                left: left,
                                top: top,
                                angle: 0,
                                padding: 10,
                                cornersize: 10,
                                hasRotatingPoint: true
                        });
                        clipart = image;
                        canvas.add(image);
                });
        });
        document.getElementById('remove-selected').onclick = function () {
                var activeObject = canvas.getActiveObject(),
                        activeGroup = canvas.getActiveGroup();
                if (activeObject) {
                        canvas.remove(activeObject);
                        $("#text-string").val("");
                } else if (activeGroup) {
                        var objectsInGroup = activeGroup.getObjects();
                        canvas.discardActiveGroup();
                        objectsInGroup.forEach(function (object) {
                                canvas.remove(object);
                        });
                }
        };
        document.getElementById('bring-to-front').onclick = function () {
                var activeObject = canvas.getActiveObject(),
                        activeGroup = canvas.getActiveGroup();
                if (activeObject) {
                        activeObject.bringToFront();
                } else if (activeGroup) {
                        var objectsInGroup = activeGroup.getObjects();
                        canvas.discardActiveGroup();
                        objectsInGroup.forEach(function (object) {
                                object.bringToFront();
                        });
                }
        };
        document.getElementById('send-to-back').onclick = function () {
                var activeObject = canvas.getActiveObject(),
                        activeGroup = canvas.getActiveGroup();
                if (activeObject) {
                        activeObject.sendToBack();
                } else if (activeGroup) {
                        var objectsInGroup = activeGroup.getObjects();
                        canvas.discardActiveGroup();
                        objectsInGroup.forEach(function (object) {
                                object.sendToBack();
                        });
                }
        };
        $("#text-bold").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.fontWeight = (activeObject.fontWeight == 'bold' ? '' : 'bold');
                        canvas.renderAll();
                }
        });
        $("#text-italic").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
                        canvas.renderAll();
                }
        });
        $("#text-strike").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
                        canvas.renderAll();
                }
        });
        $("#text-underline").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
                        canvas.renderAll();
                }
        });
        $("#text-left").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.textAlign = 'left';
                        canvas.renderAll();
                }
        });
        $("#text-center").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.textAlign = 'center';
                        canvas.renderAll();
                }
        });
        $("#text-right").click(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.textAlign = 'right';
                        canvas.renderAll();
                }
        });
        $("#font-family").change(function () {
                var activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                        activeObject.fontFamily = this.value;
                        canvas.renderAll();
                }
        });
        $('#text-bgcolor').miniColors({
                change: function (hex, rgb) {
                        var activeObject = canvas.getActiveObject();
                        if (activeObject && activeObject.type === 'text') {
                                activeObject.backgroundColor = this.value;
                                canvas.renderAll();
                        }
                },
                open: function (hex, rgb) { //
                },
                close: function (hex, rgb) { //
                }
        });
        $('#text-fontcolor').miniColors({
                change: function (hex, rgb) {
                        var activeObject = canvas.getActiveObject();
                        if (activeObject && activeObject.type === 'text') {
                                activeObject.fill = this.value;
                                canvas.renderAll();
                        }
                },
                open: function (hex, rgb) { //
                },
                close: function (hex, rgb) { //
                }
        });
        $('#text-strokecolor').miniColors({
                change: function (hex, rgb) {
                        var activeObject = canvas.getActiveObject();
                        if (activeObject && activeObject.type === 'text') {
                                activeObject.strokeStyle = this.value;
                                canvas.renderAll();
                        }
                },
                open: function (hex, rgb) { //
                },
                close: function (hex, rgb) { //
                }
        });
        $(".clearfix button,a").tooltip();
});

function onObjectSelected(e) {
        var selectedObject = e.target;
        $("#text-string").val("");
        selectedObject.hasRotatingPoint = true
        if (selectedObject && selectedObject.type === 'text') {
                //display text editor
                $("#texteditor").css('enable', 'true');
                $("#texteditor").css('display', 'block');
                $("#text-string").val(selectedObject.getText());
                $('#text-fontcolor').miniColors('value', selectedObject.fill);
                $('#text-strokecolor').miniColors('value', selectedObject.strokeStyle);
                $("#imageeditor").css('display', 'none');
        } else if (selectedObject && selectedObject.type === 'image') {
                //display image editor
                $("#texteditor").css('display', 'none');
                $("#imageeditor").css('display', 'block');
        }
}

function onSelectedCleared(e) {
        $("#text-string").val("");
        $("#texteditor").css('display', 'none');
        $("#texteditor").css('enable', 'false');
        $("#imageeditor").css('display', 'none');
}

function setFont(font) {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
                activeObject.fontFamily = font;
                canvas.renderAll();
        }
}

function removeWhite() {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'image') {
                activeObject.filters[2] = new fabric.Image.filters.RemoveWhite({
                        hreshold: 100,
                        distance: 10
                });
                //0-255, 0-255
                activeObject.applyFilters(canvas.renderAll.bind(canvas));
        }
}
