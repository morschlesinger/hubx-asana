export function strReplaceAll (target: String, search: any, replacement: string): String {
    return target.split(search).join(replacement);
};

export function getPrimaryKey(userIdentifier: String, objectId: String): String {
    return strReplaceAll(userIdentifier,";","%3B") + ";" + strReplaceAll(objectId,";","%3B");
}

export function byString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split(';');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

export function getPointersStringArray(inArray: any[], collectionFieldName: string, idPrefix: String): String[] {
    var newArray: String[] = [];
    if (inArray) {
        if (inArray.length>0) {
            inArray.forEach(function (item) {
                newArray.push(idPrefix + item[collectionFieldName]);
            });                
        } else return null;
    } else return null;
    return newArray;
}

export function SetObjectPointersByArrayAndField(userIdentifier, parentObjectArray,childrenObjectArray,pointersArrayFieldName,parentIdFieldName,childParentIdFieldName,childIdFieldName): Promise<Object> {
    return new Promise((resolve, reject) => {
        parentObjectArray.forEach(function (parentItem) {
            let newArray = [];
            childrenObjectArray.forEach(function (childItem) {
                if (parentItem[parentIdFieldName] == childItem[childParentIdFieldName]) {
                    newArray.push(userIdentifier + ';' + childItem[childIdFieldName]);
                    childItem[childParentIdFieldName]=userIdentifier + ';' + childItem[childParentIdFieldName];
                }
            });
            if (newArray.length>0) {
                parentItem[pointersArrayFieldName]=newArray;
            }
            else
                parentItem[pointersArrayFieldName]=null;
        });
        resolve(parentObjectArray);
    });        
}

export function GetNowTimestampLong(): number {
    return Math.floor(new Date().valueOf());
};