Jive - Content Viewer Widget
============================
The Content Viewer widget is a great tool for surfacing content from multiple locations on a single overview page.  This is a [Jive](https://community.jivesoftware.com/welcome) HTML widget project that uses two HTML widgets on a page.  One becomes the Table of Contents pane, and the other becomes the display panel.  Clicking an item in the TOC loads the content into the display panel for viewing.  Users can serve themselves to the content listed in the TOC and you do not have to worry with complicated menus and navigation bars to keep your sites up to date and connected.  The widget is maintained using a single Jive document with a bullet list representing the TOC.  Changes can be made to the TOC document itself to add, modify, and delete entries, as well as modifying the linked documents and sites contained in the TOC to edit the resulting content displayed.

Prerequisite
------------
The [Content Lookup](https://github.com/fmr-llc/jive-content-lookup) widget installation has essential parts of setting up this widget project.  Make sure to install the Content Lookup widget prior to continuing with the Content Viewer installation.

Upload Libraries
----------------
* Extract the content viewer widget zip archive to your local computer.
* Log into your Jive community.
* Navigate to the upload location for your library files.
* Create an Uploaded File in the Library location of your Jive community.  Drag the file "content_viewer_widget.css" to the file section of the upload.  Set the file name to "Content Viewer Widget CSS Library", put a description of your choosing, tag it, set the authors, and make sure it is being published to the correct Library location.  Click Publish.
* Create another Uploaded File in the Library location of your Jive community.  Drag the file "content_viewer_widget.js" to the file section of the upload.  Set the file name to "Content Viewer Widget JavaScript Library", put a description of your choosing, tag it, set the authors, and make sure it is being published to the correct Library location.  Click Publish.
* Create an Uploaded File in the Library location of your Jive community.  Drag the file "content_viewer_widget_builder.css" to the file section of the upload.  Set the file name to "Content Viewer Widget Builder CSS Library", put a description of your choosing, tag it, set the authors, and make sure it is being published to the correct Library location.  Click Publish.
* Create another Uploaded File in the Library location of your Jive community.  Drag the file "content_viewer_widget_builder.js" to the file section of the upload.  Set the file name to "Content Viewer Widget Builder JavaScript Library", put a description of your choosing, tag it, set the authors, and make sure it is being published to the correct Library location.  Click Publish.

Update Library Loader
---------------------
* Use the Content Lookup widget to search for "Library Loader".  Click the link to the file in the results.  If it is not found, contact your administrator.
* Download a copy of the "Library Loader" file from your community.  Open it for editing.
* Go back to the Content Lookup widget and search for "Content Viewer Widget".  You should see the four library files you uploaded to your community above.
* Find the search result for "Content Viewer Widget CSS Library" and copy its Content ID.  It should be a number like 694225.
* Update the library_loader.js file line for "content_viewer_widget_.css" and update the content ID variable (it should be 0 before updating) to the Content ID you just copied.  The result should look similar to:
```
	libraries['content_viewer_widget.css'] = { contentID: '694225' };
```
* Find the search result for "Content Viewer Widget JavaScript Library" and copy its Content ID.  It should be a number like 694226.
* Update the library_loader.js file line for "content_viewer_widget.js" and update the content ID variable (it should be 0 before updating) to the Content ID you just copied.  The result should look similar to:
```
	libraries['content_viewer_widget.js'] = { contentID: '694226' };
```
* Find the search result for "Content Viewer Widget Builder CSS Library" and copy its Content ID.  It should be a number like 694227.
* Update the library_loader.js file line for "content_viewer_widget_builder.css" and update the content ID variable (it should be 0 before updating) to the Content ID you just copied.  The result should look similar to:
```
	libraries['content_viewer_widget_builder.css'] = { contentID: '694227' };
```
* Find the search result for "Content Viewer Widget Builder JavaScript Library" and copy its Content ID.  It should be a number like 694228.
* Update the library_loader.js file line for "content_viewer_widget_bulder.js" and update the content ID variable (it should be 0 before updating) to the Content ID you just copied.  The result should look similar to:
```
	libraries['content_viewer_widget_builder.js'] = { contentID: '694228' };
```
* Save the changes to the library_loader.js file on your computer.
* Edit the "Library Loader" uploaded file in your Jive community.
* Drag the updated file from your computer to the file section of the uploaded file.  Click Publish.

You have now updated the Library Loader in your Jive community with the library files needed to run the Content Viewer widget.

Install the Content Viewer Widget Builder application
-----------------------------------------------------
* Use the Content Lookup widget to search for "jQuery Library".  Copy the Content ID.  It should be a number like "694224"
* Look in the accordion widget archive on your computer and edit the "content_viewer_widget_builder.html" file.
* Find the jquery_content_id and replace the zero in the quotes with the Content ID you just copied.  The result should look similar to:
```
	var jquery_content_id = "694224";
```
* Go back to the Content Lookup widget and get the Binary URL for "jQuery Library".  It should look similar to:
```
	https://myjiveinstance.mycompany.com/api/core/v3/attachments/file/694224/data
```
* Edit the "content_viewer_widget_builder.html" file again.
* Find the line:
```
    <script src='JQUERY'></script>
```
replace the text JQUERY with the URL you just copied.  It should end up looking similar to:
```
    <script src='https://myjiveinstance.mycompany.com/api/core/v3/attachments/file/694224/data'></script>
```
* Use the Content Lookup widget to search for "Library Loader".  Copy the Content ID.
* Edit the "content_viewer_widget_builder.html" file again.
* Find the library_loader_content_id and replace the zero in the quotes with the Content ID you just copied.  The result should look similar to:
```
	var library_loader_content_id = "694223";
```
* Save the file.
* Go to the site you want to put the Content Viewer Builder application in your community, and go to the Overview page.
* Manage the Overview page, and drag a new HTML widget onto the page.
* Edit the new HTML Widget.
* Copy the updated code from "content_viewer_widget_builder.html" and paste it into the "Your HTML" entry field in the new widget.
* Click "Save Properties".
* Click "Publish Layout".

Your Content Viewer Builder is now set up.  Site admins can use the below instructions to create their own content viewers...

Creating a Content Viewer Table of Contents (TOC) document
-----------------------------------------------------------
* Create a document in a place that users will have at least read access.
* Click the Bullet List button in the editor.
* Create a bullet list of items that will make up the Table of Contents.  Each item in the list must be a hyper-link, which is what the viewer will load into the view pane when that TOC item is clicked.  The list can be indented to create sub-menu items.  The left aligned items will be the outer most items in the table.  Items that are indented will be sub-menu items of the above outer item.  You can have (at most) two levels of indention (sub-menus).  For instance, the following bullet list:
<p></p>
  * Menu item 1
  * Menu item 2
    * Menu item 2.1
      * Menu item 2.1.1
      * Menu item 2.1.2
    * Menu item 2.2
  * Menu item 3
    * Menu item 3.1
    * Menu item 3.2
<p>&nbsp;&nbsp;&nbsp;&nbsp; will generate the following Table of Contents:</p>
<p>Menu item 1</p>
<p>Menu item 2</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;Menu item 2.1</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Menu item 2.1.1</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Menu item 2.1.2</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;Menu item 2.2</p>
<p>Menu item 3</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;Menu item 3.1</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;Menu item 3.2</p>
* You can include hyperlinks to Jive content (documents, uploaded files, discussions, blogs, etc.), containers (group, project, and space overview, activity, content etc), People, and external links.  The viewer recognizes most item type stored in Jive, and makes a "best effort" to load them into the viewer.  It should be noted that Jive uses Ajax loaded objects to format and populate several page types after the initial load.  This means that the initial page load does not contain the completed view of the content, so the viewer does not have everything it needs to display the page in the viewer the way it normally does when you go to the page.  Examples of this are Task Lists, Calendars, certain parts of Activity pages, etc.  People Profile pages are heavily modified to display useful information in the viewer.  Microsoft Office content (Word documents, Excel files, etc.) that have a preview will have their document preview displayed.  Overview pages are displayed including all widgets.
* After entering the bullet items, making sure each line has a hyperlink, and indenting the list to represent the menu levels, there is one more step I find useful.  The Jive editor puts formatting around internal content.  It is very cumbersome trying to predict everything the Jive editor can possibly do behind the scenes, so I find it best to remove any of that formatting prior to publishing the document.  Highlight the entire bullet list, and then click the Remove Formatting button in the editor several times.  This usually removes anything that causes the Table of Contents not to process correctly.
* Once your TOC document is completed, publish the document and copy the URL.

Build the Content Viewer
------------------------
* Go to the Overview page that you installed the Content Viewer Builder application.
* Paste the TOC document URL you copied in the section above.
* Check the "Show TOC Icons" checkox if you want the small jive icons for internal content, or uncheck it if you want them removed.
* Click Next and the code for two separate widgets will be generated.  Copy the top code for the TOC first.
* Go to the overview page you want to put the Content Viewer.
* Drag an HTML Widget into a column.  This widget will become the Table of Contents, so it works best in a narrow column.
* Edit the widget.  Paste the code you just copied.
* Click on Save Properties.
* Go back to the Content Viewer Builder.  Copy the code in the bottom area.
* Go back to the overview page with the Content Viewer you are building.
* Drag another HTML widget into another column on your page.  This will become the viewer, so a wide column works best.
* Edit the widget.
* Paste the code you just copied.
* Click Save Properties.
* Publish the page.

Usage
-----
Once the Content Viewer is setup and operational, users can click on the items in the Table of Content and the content will be loaded into the viewer pane.

If changes are need to the Table of Contents, the setup document and hyperlinked pages can be edited and the changes will be picked up the next refresh.

Issues
------
If your widget is not working as expected, please check out [Issues](docs/issues.md)

Additional Jive-n widget projects in this series
------------------------------------------------
* [Accordion widget](https://github.com/fmr-llc/jive-accordion)
* [Content Lookup](https://github.com/fmr-llc/jive-content-lookup)
* [Export widget](https://github.com/fmr-llc/jive-export-followers)
* [Form widget](https://github.com/fmr-llc/jive-form)
* [Form Report widget](https://github.com/fmr-llc/jive-form-report)
* [Menu Bar widget](https://github.com/fmr-llc/jive-menu)
* [Picture Carousel widget](https://github.com/fmr-llc/jive-picture-carousel)
* [Presentation widget](https://github.com/fmr-llc/jive-presentation)
* [Search widget](https://github.com/fmr-llc/jive-advanced-search)
* [Team Listing widget](www.github.com/fmr-llc/jive-team-listing)

Contributing
------------
If you would like to contribute to this project, please check out [Contributing](docs/contributing.md)

License
-------
(c) 2015 Fidelity Investments
Licensed under the [Apache License](docs/LICENSE), Version 2.0